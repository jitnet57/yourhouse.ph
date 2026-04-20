from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

router = APIRouter(
    prefix="/api/reports",
    tags=["reports"]
)

# Models
class ReportCreate(BaseModel):
    name: str
    description: Optional[str] = None
    report_type: str
    frequency: str  # once, daily, weekly, monthly
    format: str  # pdf, excel, csv
    filters: Optional[Dict[str, Any]] = None

class Report(BaseModel):
    id: str
    name: str
    description: Optional[str]
    report_type: str
    created_by: str
    created_at: str
    updated_at: str
    frequency: str
    format: str
    status: str  # scheduled, running, completed
    next_run: Optional[str] = None
    last_run: Optional[str] = None
    file_url: Optional[str] = None

class ExportRequest(BaseModel):
    report_id: str
    format: str  # pdf, excel, csv

# In-memory storage
reports_db: Dict[str, Report] = {
    "1": Report(
        id="1",
        name="Weekly Lead Summary",
        description="Overview of leads generated this week",
        report_type="leads",
        created_by="John Admin",
        created_at="2026-04-15",
        updated_at="2026-04-17",
        frequency="weekly",
        format="pdf",
        status="scheduled",
        next_run="2026-04-21"
    ),
    "2": Report(
        id="2",
        name="Monthly Revenue Report",
        description="Total revenue and conversion metrics",
        report_type="revenue",
        created_by="Maria Manager",
        created_at="2026-04-01",
        updated_at="2026-04-17",
        frequency="monthly",
        format="excel",
        status="completed",
        last_run="2026-04-01"
    )
}

# Endpoints

@router.get("/", response_model=List[Report])
async def list_reports(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    """Get all reports with pagination"""
    reports_list = list(reports_db.values())
    return reports_list[skip:skip + limit]

@router.get("/{report_id}", response_model=Report)
async def get_report(report_id: str):
    """Get specific report details"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    return reports_db[report_id]

@router.post("/", response_model=Report)
async def create_report(report: ReportCreate):
    """Create a new report"""
    report_id = str(len(reports_db) + 1)
    now = datetime.now().isoformat().split("T")[0]
    
    new_report = Report(
        id=report_id,
        name=report.name,
        description=report.description,
        report_type=report.report_type,
        created_by="Current User",
        created_at=now,
        updated_at=now,
        frequency=report.frequency,
        format=report.format,
        status="scheduled" if report.frequency != "once" else "completed",
        next_run=now if report.frequency != "once" else None
    )
    reports_db[report_id] = new_report
    return new_report

@router.put("/{report_id}", response_model=Report)
async def update_report(report_id: str, report: ReportCreate):
    """Update existing report"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    
    existing = reports_db[report_id]
    existing.name = report.name
    existing.description = report.description
    existing.report_type = report.report_type
    existing.frequency = report.frequency
    existing.format = report.format
    existing.updated_at = datetime.now().isoformat().split("T")[0]
    
    return existing

@router.delete("/{report_id}")
async def delete_report(report_id: str):
    """Delete a report"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    
    del reports_db[report_id]
    return {"message": "Report deleted successfully"}

@router.post("/{report_id}/generate")
async def generate_report(report_id: str):
    """Generate/run a report"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report = reports_db[report_id]
    report.status = "running"
    
    # Mock: Simulate report generation
    report.status = "completed"
    report.last_run = datetime.now().isoformat().split("T")[0]
    report.file_url = f"https://api.yourhouse.ph/reports/{report_id}/download"
    
    return {"message": "Report generated successfully", "report": report}

@router.post("/{report_id}/export")
async def export_report(report_id: str, export_format: str = Query("pdf")):
    """Export a generated report"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report = reports_db[report_id]
    
    if report.status != "completed":
        raise HTTPException(status_code=400, detail="Report must be generated first")
    
    if export_format not in ["pdf", "excel", "csv"]:
        raise HTTPException(status_code=400, detail="Invalid export format")
    
    # Mock: Return download URL
    return {
        "report_id": report_id,
        "format": export_format,
        "download_url": f"https://api.yourhouse.ph/reports/{report_id}/download?format={export_format}",
        "filename": f"{report.name}.{export_format}"
    }

@router.post("/{report_id}/schedule")
async def schedule_report(report_id: str, frequency: str, time: str):
    """Update report scheduling"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    
    valid_frequencies = ["once", "daily", "weekly", "monthly"]
    if frequency not in valid_frequencies:
        raise HTTPException(status_code=400, detail="Invalid frequency")
    
    report = reports_db[report_id]
    report.frequency = frequency
    report.status = "scheduled"
    
    return {
        "report_id": report_id,
        "frequency": frequency,
        "scheduled_time": time,
        "message": f"Report scheduled to run {frequency} at {time}"
    }

@router.get("/statistics/summary")
async def get_report_statistics():
    """Get report generation statistics"""
    total = len(reports_db)
    completed = sum(1 for r in reports_db.values() if r.status == "completed")
    scheduled = sum(1 for r in reports_db.values() if r.status == "scheduled")
    running = sum(1 for r in reports_db.values() if r.status == "running")
    
    by_type = {}
    for report in reports_db.values():
        t = report.report_type
        by_type[t] = by_type.get(t, 0) + 1
    
    return {
        "total_reports": total,
        "completed": completed,
        "scheduled": scheduled,
        "running": running,
        "by_type": by_type
    }

@router.post("/bulk/generate")
async def bulk_generate_reports(report_ids: List[str]):
    """Generate multiple reports"""
    generated = []
    failed = []
    
    for report_id in report_ids:
        if report_id in reports_db:
            report = reports_db[report_id]
            report.status = "completed"
            report.last_run = datetime.now().isoformat().split("T")[0]
            generated.append(report_id)
        else:
            failed.append(report_id)
    
    return {
        "generated_count": len(generated),
        "failed_count": len(failed),
        "generated": generated,
        "failed": failed
    }

@router.get("/downloads/{report_id}")
async def download_report(report_id: str, format: str = Query("pdf")):
    """Download report (mock endpoint)"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report = reports_db[report_id]
    
    return {
        "id": report_id,
        "filename": f"{report.name}.{format}",
        "content_type": f"application/{format}" if format != "pdf" else "application/pdf",
        "size_bytes": 1024 * 256,  # Mock: 256MB
        "download_url": f"https://api.yourhouse.ph/reports/{report_id}/file.{format}"
    }
