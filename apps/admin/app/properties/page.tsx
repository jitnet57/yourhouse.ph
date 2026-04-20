'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as XLSX from 'xlsx'
import {
  Plus, Search, Filter, MoreVertical, X, Upload, ImagePlus,
  Home, DollarSign, MapPin, Ruler, BedDouble, Bath,
  CheckCircle2, Tag, FileSpreadsheet, Download, AlertTriangle,
  ChevronDown, Eye, Trash2
} from 'lucide-react'

interface Property {
  id: string
  title: string
  address: string
  price: number
  status: string
  aiScore: number
  views: number
  type: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  description?: string
  images: string[]
}

interface PropertyForm {
  title: string
  address: string
  price: string
  type: string
  status: string
  bedrooms: string
  bathrooms: string
  area: string
  description: string
  images: File[]
  previews: string[]
}

interface ExcelRow {
  title: string
  address: string
  price: number
  type: string
  status: string
  bedrooms: number
  bathrooms: number
  area: number
  description: string
}

const PROPERTY_TYPES = ['Condo', 'House & Lot', 'Townhouse', 'Commercial', 'Land', 'Apartment']
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'pending', label: 'Pending', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'sold', label: 'Sold', color: 'text-slate-700 bg-slate-100 border-slate-200' },
  { value: 'for_rent', label: 'For Rent', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
]

const defaultForm: PropertyForm = {
  title: '', address: '', price: '', type: 'Condo', status: 'active',
  bedrooms: '', bathrooms: '', area: '', description: '', images: [], previews: [],
}

const EXCEL_TEMPLATE_HEADERS = [
  'title', 'address', 'price', 'type', 'status', 'bedrooms', 'bathrooms', 'area', 'description'
]

function statusBadge(status: string) {
  const s = STATUS_OPTIONS.find((o) => o.value === status)
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${s?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {s?.label ?? status}
    </span>
  )
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([
    { id: '1', title: 'Luxury Condo in BGC', address: 'Fort Bonifacio, Taguig', price: 5500000, status: 'active', aiScore: 98, views: 342, type: 'Condo', bedrooms: 3, bathrooms: 2, area: 120, images: [] },
    { id: '2', title: 'House & Lot in Cavite', address: 'Kawit, Cavite', price: 2800000, status: 'active', aiScore: 92, views: 215, type: 'House & Lot', bedrooms: 4, bathrooms: 3, area: 200, images: [] },
    { id: '3', title: 'Studio Unit Makati', address: 'Salcedo Village, Makati', price: 3200000, status: 'pending', aiScore: 85, views: 98, type: 'Condo', bedrooms: 1, bathrooms: 1, area: 32, images: [] },
  ])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showExcelModal, setShowExcelModal] = useState(false)
  const [form, setForm] = useState<PropertyForm>(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [excelDragOver, setExcelDragOver] = useState(false)
  const [excelRows, setExcelRows] = useState<ExcelRow[]>([])
  const [excelErrors, setExcelErrors] = useState<string[]>([])
  const [excelImporting, setExcelImporting] = useState(false)
  const [excelSuccess, setExcelSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const excelInputRef = useRef<HTMLInputElement>(null)

  const filtered = properties.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase())
  )

  // ---- Image helpers ----
  const handleImageFiles = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f))
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newFiles], previews: [...prev.previews, ...newPreviews] }))
  }

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(form.previews[idx])
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
      previews: prev.previews.filter((_, i) => i !== idx),
    }))
  }

  // ---- Submit single property ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setProperties((prev) => [{
      id: Date.now().toString(),
      title: form.title, address: form.address,
      price: Number(form.price), status: form.status, type: form.type,
      bedrooms: Number(form.bedrooms) || undefined,
      bathrooms: Number(form.bathrooms) || undefined,
      area: Number(form.area) || undefined,
      description: form.description,
      aiScore: Math.floor(Math.random() * 15) + 80, views: 0,
      images: form.previews,
    }, ...prev])
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setShowModal(false); setForm(defaultForm) }, 1200)
  }

  const closeModal = () => {
    form.previews.forEach((url) => URL.revokeObjectURL(url))
    setForm(defaultForm); setShowModal(false); setSuccess(false)
  }

  // ---- Excel helpers ----
  const downloadTemplate = () => {
    const sampleData = [
      EXCEL_TEMPLATE_HEADERS,
      ['Luxury Condo BGC', 'Fort Bonifacio, Taguig', 5500000, 'Condo', 'active', 3, 2, 120, 'Prime BGC location'],
      ['House in Quezon City', 'Diliman, QC', 8000000, 'House & Lot', 'active', 5, 3, 350, 'Near UP campus'],
    ]
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(sampleData)
    ws['!cols'] = EXCEL_TEMPLATE_HEADERS.map((_, i) => ({ wch: [30, 30, 12, 14, 10, 10, 10, 10, 40][i] }))
    XLSX.utils.book_append_sheet(wb, ws, 'Properties')
    XLSX.writeFile(wb, 'properties_template.xlsx')
  }

  const parseExcel = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)

        const errors: string[] = []
        const parsed: ExcelRow[] = []

        rows.forEach((row, i) => {
          const rowNum = i + 2
          if (!row.title) errors.push(`Row ${rowNum}: 'title' is required`)
          if (!row.address) errors.push(`Row ${rowNum}: 'address' is required`)
          if (!row.price || isNaN(Number(row.price))) errors.push(`Row ${rowNum}: 'price' must be a number`)
          if (errors.length === 0) {
            parsed.push({
              title: String(row.title ?? ''),
              address: String(row.address ?? ''),
              price: Number(row.price ?? 0),
              type: String(row.type ?? 'Condo'),
              status: String(row.status ?? 'active'),
              bedrooms: Number(row.bedrooms ?? 0),
              bathrooms: Number(row.bathrooms ?? 0),
              area: Number(row.area ?? 0),
              description: String(row.description ?? ''),
            })
          }
        })

        setExcelErrors(errors)
        setExcelRows(parsed)
      } catch {
        setExcelErrors(['Failed to parse file. Please use the provided template.'])
        setExcelRows([])
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleExcelFile = (files: FileList | null) => {
    if (!files?.[0]) return
    const file = files[0]
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setExcelErrors(['Only .xlsx, .xls, or .csv files are supported'])
      return
    }
    setExcelErrors([])
    setExcelRows([])
    parseExcel(file)
  }

  const importExcelRows = async () => {
    setExcelImporting(true)
    await new Promise((r) => setTimeout(r, 800))
    const newProps: Property[] = excelRows.map((row, i) => ({
      id: `excel-${Date.now()}-${i}`,
      ...row, aiScore: Math.floor(Math.random() * 15) + 80, views: 0, images: [],
    }))
    setProperties((prev) => [...newProps, ...prev])
    setExcelImporting(false)
    setExcelSuccess(true)
    setTimeout(() => { setExcelSuccess(false); setShowExcelModal(false); setExcelRows([]) }, 1500)
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Properties</h1>
          <p className="text-sm text-slate-500 mt-0.5">{properties.length} total listings</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setShowExcelModal(true)}
            className="btn-secondary gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Excel Import
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">AI Score</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((prop) => (
              <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-50 flex-shrink-0 flex items-center justify-center">
                      {prop.images[0]
                        ? <img src={prop.images[0]} className="w-full h-full object-cover" />
                        : <Home className="w-5 h-5 text-indigo-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{prop.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{prop.address}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-lg font-medium">{prop.type}</span>
                    {prop.bedrooms && <span>{prop.bedrooms}BR</span>}
                    {prop.area && <span>{prop.area}㎡</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₱{prop.price.toLocaleString()}</td>
                <td className="px-6 py-4">{statusBadge(prop.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${prop.aiScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{prop.aiScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  <Home className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No properties found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ====== ADD PROPERTY MODAL ====== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in-up">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New Property</h2>
                <p className="text-sm text-slate-500 mt-0.5">Fill in the details and upload photos</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  <ImagePlus className="inline w-4 h-4 mr-1.5 -mt-0.5" />Property Photos
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageFiles(e.dataTransfer.files) }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
                    ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <p className="text-sm font-semibold text-slate-700">Drop photos or <span className="text-indigo-600">browse</span></p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP — up to 10 files</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageFiles(e.target.files)} />
                </div>
                {form.previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {form.previews.map((src, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {i === 0 && <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">Cover</span>}
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white items-center justify-center hidden group-hover:flex">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center hover:border-indigo-300 transition">
                      <Plus className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2"><Home className="inline w-4 h-4 mr-1.5 -mt-0.5" />Title *</label>
                <input required type="text" placeholder="e.g. 3BR Luxury Condo in BGC" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2"><MapPin className="inline w-4 h-4 mr-1.5 -mt-0.5" />Address *</label>
                <input required type="text" placeholder="Street, City, Province" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2"><DollarSign className="inline w-4 h-4 mr-1.5 -mt-0.5" />Price (₱) *</label>
                  <input required type="number" placeholder="e.g. 5500000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2"><Tag className="inline w-4 h-4 mr-1.5 -mt-0.5" />Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2"><BedDouble className="inline w-4 h-4 mr-1.5 -mt-0.5" />Bedrooms</label>
                  <input type="number" min="0" placeholder="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2"><Bath className="inline w-4 h-4 mr-1.5 -mt-0.5" />Bathrooms</label>
                  <input type="number" min="0" placeholder="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2"><Ruler className="inline w-4 h-4 mr-1.5 -mt-0.5" />Area (sqm)</label>
                  <input type="number" min="0" placeholder="0" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s.value} type="button" onClick={() => setForm({ ...form, status: s.value })}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all
                        ${form.status === s.value ? s.color + ' ring-2 ring-offset-1 ring-current' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea rows={3} placeholder="Describe amenities, location, features..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting || success} className="flex-1 btn-primary disabled:opacity-70">
                  {success ? <><CheckCircle2 className="w-4 h-4" />Saved!</>
                    : submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                    : <><Plus className="w-4 h-4" />Add Property</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== EXCEL IMPORT MODAL ====== */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowExcelModal(false); setExcelRows([]); setExcelErrors([]) }} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl animate-fade-in-up">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  Excel Bulk Import
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">Upload .xlsx or .csv to add multiple properties at once</p>
              </div>
              <button onClick={() => { setShowExcelModal(false); setExcelRows([]); setExcelErrors([]) }} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Download template */}
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Download Template</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Use our template for correct column format</p>
                </div>
                <button onClick={downloadTemplate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                  Download .xlsx
                </button>
              </div>

              {/* Column guide */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Required Columns</p>
                </div>
                <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100 text-xs">
                  {[
                    { col: 'title', desc: 'Property name', req: true },
                    { col: 'address', desc: 'Full address', req: true },
                    { col: 'price', desc: 'Number (no commas)', req: true },
                    { col: 'type', desc: 'Condo / House & Lot / etc.', req: false },
                    { col: 'status', desc: 'active / pending / sold', req: false },
                    { col: 'bedrooms', desc: 'Number', req: false },
                    { col: 'bathrooms', desc: 'Number', req: false },
                    { col: 'area', desc: 'sqm', req: false },
                    { col: 'description', desc: 'Free text', req: false },
                  ].map((item) => (
                    <div key={item.col} className="px-4 py-3 flex items-start gap-2 hover:bg-slate-50">
                      <code className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.col}</code>
                      {item.req && <span className="text-red-500 font-bold">*</span>}
                      <span className="text-slate-500">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setExcelDragOver(true) }}
                onDragLeave={() => setExcelDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setExcelDragOver(false); handleExcelFile(e.dataTransfer.files) }}
                onClick={() => excelInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                  ${excelDragOver ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'}`}
              >
                <FileSpreadsheet className={`w-10 h-10 mx-auto mb-3 ${excelDragOver ? 'text-emerald-500' : 'text-slate-400'}`} />
                <p className="text-sm font-semibold text-slate-700">Drop your Excel file or <span className="text-emerald-600">browse</span></p>
                <p className="text-xs text-slate-400 mt-1">Supports .xlsx, .xls, .csv</p>
                <input ref={excelInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => handleExcelFile(e.target.files)} />
              </div>

              {/* Errors */}
              {excelErrors.length > 0 && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <p className="text-sm font-semibold text-red-700">Validation Errors</p>
                  </div>
                  {excelErrors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600 pl-6">{err}</p>
                  ))}
                </div>
              )}

              {/* Preview Table */}
              {excelRows.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-slate-700">
                      Preview — <span className="text-emerald-600">{excelRows.length} rows ready to import</span>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          {['Title', 'Address', 'Price', 'Type', 'Status', 'BR', 'BA', 'sqm'].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {excelRows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-medium text-slate-800 max-w-[160px] truncate">{row.title}</td>
                            <td className="px-4 py-2.5 text-slate-500 max-w-[140px] truncate">{row.address}</td>
                            <td className="px-4 py-2.5 font-semibold text-slate-800">₱{Number(row.price).toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-slate-500">{row.type}</td>
                            <td className="px-4 py-2.5">{statusBadge(row.status)}</td>
                            <td className="px-4 py-2.5 text-slate-500">{row.bedrooms || '-'}</td>
                            <td className="px-4 py-2.5 text-slate-500">{row.bathrooms || '-'}</td>
                            <td className="px-4 py-2.5 text-slate-500">{row.area || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => { setExcelRows([]); setExcelErrors([]) }} className="flex-1 btn-secondary">
                      Clear
                    </button>
                    <button onClick={importExcelRows} disabled={excelImporting || excelSuccess} className="flex-1 btn-primary disabled:opacity-70">
                      {excelSuccess ? <><CheckCircle2 className="w-4 h-4" />{excelRows.length} properties imported!</>
                        : excelImporting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Importing...</>
                        : <><FileSpreadsheet className="w-4 h-4" />Import {excelRows.length} Properties</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
