from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

router = APIRouter(
    prefix="/api/agents",
    tags=["agents"]
)

# Models
class AgentConfig(BaseModel):
    language_model: str
    temperature: float
    max_tokens: int
    system_prompt: str

class Agent(BaseModel):
    id: str
    name: str
    status: str  # active, inactive, error
    model: str
    response_time_ms: int
    accuracy_score: float
    calls_today: int
    last_activity: str
    configuration: AgentConfig

class AgentCreate(BaseModel):
    name: str
    model: str
    configuration: AgentConfig

class PerformanceMetric(BaseModel):
    time: str
    accuracy: float
    response_time: float
    success_rate: float

# In-memory storage (replace with database)
agents_db: Dict[str, Agent] = {
    "1": Agent(
        id="1",
        name="Property Analyzer AI",
        status="active",
        model="gpt-4-turbo",
        response_time_ms=145,
        accuracy_score=94.2,
        calls_today=1245,
        last_activity="2 minutes ago",
        configuration=AgentConfig(
            language_model="gpt-4-turbo",
            temperature=0.7,
            max_tokens=2000,
            system_prompt="You are a real estate analysis expert..."
        )
    ),
    "2": Agent(
        id="2",
        name="Lead Qualification Bot",
        status="active",
        model="gpt-3.5-turbo",
        response_time_ms=87,
        accuracy_score=91.5,
        calls_today=2341,
        last_activity="30 seconds ago",
        configuration=AgentConfig(
            language_model="gpt-3.5-turbo",
            temperature=0.5,
            max_tokens=1000,
            system_prompt="You are a lead qualification specialist..."
        )
    )
}

# Endpoints

@router.get("/", response_model=List[Agent])
async def list_agents(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    """Get all deployed agents with pagination"""
    agents_list = list(agents_db.values())
    return agents_list[skip:skip + limit]

@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: str):
    """Get specific agent details"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agents_db[agent_id]

@router.post("/", response_model=Agent)
async def create_agent(agent: AgentCreate):
    """Create a new AI agent"""
    agent_id = str(len(agents_db) + 1)
    new_agent = Agent(
        id=agent_id,
        name=agent.name,
        status="active",
        model=agent.model,
        response_time_ms=0,
        accuracy_score=0.0,
        calls_today=0,
        last_activity=str(datetime.now()),
        configuration=agent.configuration
    )
    agents_db[agent_id] = new_agent
    return new_agent

@router.put("/{agent_id}", response_model=Agent)
async def update_agent(agent_id: str, agent: AgentCreate):
    """Update agent configuration"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    updated_agent = agents_db[agent_id]
    updated_agent.name = agent.name
    updated_agent.model = agent.model
    updated_agent.configuration = agent.configuration
    return updated_agent

@router.delete("/{agent_id}")
async def delete_agent(agent_id: str):
    """Delete an agent"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    del agents_db[agent_id]
    return {"message": "Agent deleted successfully"}

@router.post("/{agent_id}/toggle-status")
async def toggle_agent_status(agent_id: str, status: str):
    """Toggle agent between active/inactive"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if status not in ["active", "inactive"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    agents_db[agent_id].status = status
    return {"agent_id": agent_id, "status": status}

@router.get("/{agent_id}/metrics", response_model=List[PerformanceMetric])
async def get_agent_metrics(agent_id: str):
    """Get performance metrics for an agent"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Mock performance data
    metrics = [
        PerformanceMetric(time="08:00", accuracy=92, response_time=145, success_rate=96),
        PerformanceMetric(time="10:00", accuracy=93, response_time=138, success_rate=97),
        PerformanceMetric(time="12:00", accuracy=91, response_time=156, success_rate=95),
        PerformanceMetric(time="14:00", accuracy=94, response_time=142, success_rate=98),
        PerformanceMetric(time="16:00", accuracy=93.5, response_time=150, success_rate=97),
        PerformanceMetric(time="18:00", accuracy=92.8, response_time=148, success_rate=96)
    ]
    return metrics

@router.post("/{agent_id}/test")
async def test_agent(agent_id: str, message: str):
    """Test an agent with a sample message"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = agents_db[agent_id]
    # Mock response (replace with actual AI integration)
    return {
        "agent_id": agent_id,
        "agent_name": agent.name,
        "input": message,
        "output": f"Response from {agent.name}: [Mock AI Response]",
        "response_time_ms": agent.response_time_ms,
        "confidence_score": agent.accuracy_score
    }

@router.get("/{agent_id}/messages")
async def get_agent_messages(agent_id: str, limit: int = Query(20, ge=1, le=100)):
    """Get message history for an agent"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Mock message history
    messages = [
        {
            "id": f"msg_{i}",
            "timestamp": f"2026-04-17T{10+i:02d}:00:00Z",
            "input": f"Sample lead qualification query {i}",
            "output": f"Analysis result {i}",
            "confidence": 0.85 + (i * 0.01)
        }
        for i in range(min(limit, 10))
    ]
    return {"agent_id": agent_id, "messages": messages}

@router.post("/{agent_id}/reset-metrics")
async def reset_agent_metrics(agent_id: str):
    """Reset performance metrics for an agent"""
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = agents_db[agent_id]
    agent.response_time_ms = 0
    agent.calls_today = 0
    return {"message": "Metrics reset successfully", "agent_id": agent_id}
