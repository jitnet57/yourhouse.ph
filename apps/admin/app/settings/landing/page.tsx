'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Image as ImageIcon, Link as LinkIcon, Palette, Sparkles,
  Type, MousePointerClick, Eye, Save, Upload, CheckCircle2,
  AlertTriangle, Wand2, RotateCcw, Globe,
} from 'lucide-react'
import { useLanguage, Lang } from '@/lib/i18n'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ─── Types ─────────────────────────────────────────────────────────────────
type Direction = 'to-t' | 'to-tr' | 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl'
type HeroSource = 'upload' | 'url' | 'gradient'

interface LandingState {
  heroSource: HeroSource
  heroUrl: string
  overlayColor: string
  overlayAlpha: number
  gradientFrom: string
  gradientTo: string
  gradientDirection: Direction
  headlineI18n: Record<Lang, string>
  subtextI18n: Record<Lang, string>
  ctaTextI18n: Record<Lang, string>
  ctaColor: string
  ctaUrl: string
}

const DIRECTION_ANGLES: Record<Direction, number> = {
  'to-t': 0, 'to-tr': 45, 'to-r': 90, 'to-br': 135,
  'to-b': 180, 'to-bl': 225, 'to-l': 270, 'to-tl': 315,
}

const DEFAULT_STATE: LandingState = {
  heroSource: 'gradient',
  heroUrl: '',
  overlayColor: '#0f172a',
  overlayAlpha: 0.5,
  gradientFrom: '#6366f1',
  gradientTo: '#ec4899',
  gradientDirection: 'to-br',
  headlineI18n: { en: 'Find Your Dream Home', ko: '당신의 꿈의 집을 찾아보세요', ja: '理想の住まいを見つけよう', zh: '找到您的梦想家园' },
  subtextI18n: { en: 'AI-powered real estate, tailored to you.', ko: 'AI 기반 맞춤형 부동산 플랫폼.', ja: 'AIが導く、あなた専用の不動産体験。', zh: 'AI驱动，为您量身定制的房地产平台。' },
  ctaTextI18n: { en: 'Get Started', ko: '시작하기', ja: '始める', zh: '立即开始' },
  ctaColor: '#6366f1',
  ctaUrl: '/signup',
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function LandingEditorPage() {
  const { lang } = useLanguage()
  const [state, setState] = useState<LandingState>(DEFAULT_STATE)
  const [previewLang, setPreviewLang] = useState<Lang>(lang)
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [a11yIssues, setA11yIssues] = useState<string[]>([])
  const [brandKeywords, setBrandKeywords] = useState('luxury condo, makati, smart home')
  const [tone, setTone] = useState<'professional' | 'friendly' | 'bold' | 'minimal'>('professional')
  const fileRef = useRef<HTMLInputElement>(null)

  const debounced = useDebounced(state, 500)

  const update = useCallback(<K extends keyof LandingState>(key: K, value: LandingState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateI18n = useCallback(
    (field: 'headlineI18n' | 'subtextI18n' | 'ctaTextI18n', l: Lang, value: string) => {
      setState((prev) => ({ ...prev, [field]: { ...prev[field], [l]: value } }))
    },
    []
  )

  // ─── Auto-save draft + fetch a11y ──────────────────────────────────────
  useEffect(() => {
    const ctrl = new AbortController()
    const body = {
      tenant_id: 'default',
      user_id: 'admin',
      hero_url: debounced.heroUrl,
      overlay_color: debounced.overlayColor,
      overlay_alpha: debounced.overlayAlpha,
      gradient_from: debounced.gradientFrom,
      gradient_to: debounced.gradientTo,
      gradient_direction: debounced.gradientDirection,
      headline_i18n: debounced.headlineI18n,
      subtext_i18n: debounced.subtextI18n,
      cta_text_i18n: debounced.ctaTextI18n,
      cta_color: debounced.ctaColor,
      cta_url: debounced.ctaUrl,
    }
    fetch(`${API_BASE}/api/landing/save-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setSaved(true)
          setA11yIssues(data.accessibility_issues || [])
          setTimeout(() => setSaved(false), 1500)
        }
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [debounced])

  // ─── Hero upload ────────────────────────────────────────────────────────
  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    setUploading(true)
    try {
      const form = new FormData()
      form.append('tenant_id', 'default')
      form.append('file', file)
      const res = await fetch(`${API_BASE}/api/landing/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (data.uploaded_url) {
        update('heroUrl', data.uploaded_url)
        update('heroSource', 'upload')
      }
    } finally {
      setUploading(false)
    }
  }

  // ─── AI generate ────────────────────────────────────────────────────────
  const handleAIGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`${API_BASE}/api/landing/ai-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: 'default',
          brand_keywords: brandKeywords.split(',').map((s) => s.trim()).filter(Boolean),
          tone,
          generate_langs: ['en', 'ko', 'ja', 'zh'],
          // include current values so backend has defaults for required fields
          overlay_color: state.overlayColor,
          overlay_alpha: state.overlayAlpha,
          gradient_from: state.gradientFrom,
          gradient_to: state.gradientTo,
          gradient_direction: state.gradientDirection,
          cta_color: state.ctaColor,
          cta_url: state.ctaUrl,
          hero_url: state.heroUrl,
          headline_i18n: state.headlineI18n,
          subtext_i18n: state.subtextI18n,
          cta_text_i18n: state.ctaTextI18n,
        }),
      })
      const data = await res.json()
      if (data.headline_i18n) update('headlineI18n', data.headline_i18n)
      if (data.subtext_i18n) update('subtextI18n', data.subtext_i18n)
      if (data.cta_text_i18n) update('ctaTextI18n', data.cta_text_i18n)
    } finally {
      setGenerating(false)
    }
  }

  // ─── Publish ────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (a11yIssues.length > 0) {
      if (!confirm('Accessibility issues exist. Publish anyway?')) return
    }
    setPublishing(true)
    try {
      const res = await fetch(`${API_BASE}/api/landing/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: 'default',
          user_id: 'admin',
          hero_url: state.heroUrl,
          overlay_color: state.overlayColor,
          overlay_alpha: state.overlayAlpha,
          gradient_from: state.gradientFrom,
          gradient_to: state.gradientTo,
          gradient_direction: state.gradientDirection,
          headline_i18n: state.headlineI18n,
          subtext_i18n: state.subtextI18n,
          cta_text_i18n: state.ctaTextI18n,
          cta_color: state.ctaColor,
          cta_url: state.ctaUrl,
        }),
      })
      if (res.ok) alert('✅ Published!')
      else { const err = await res.json(); alert(`❌ ${JSON.stringify(err.detail)}`) }
    } finally {
      setPublishing(false)
    }
  }

  // ─── Preview CSS ────────────────────────────────────────────────────────
  const previewStyle = useMemo(() => {
    const angle = DIRECTION_ANGLES[state.gradientDirection]
    const bg = state.heroSource === 'gradient' || !state.heroUrl
      ? `linear-gradient(${angle}deg, ${state.gradientFrom}, ${state.gradientTo})`
      : `url(${state.heroUrl}) center/cover`
    return {
      background: bg,
    } as React.CSSProperties
  }, [state])

  const overlayRgba = hexToRgba(state.overlayColor, state.overlayAlpha)

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Landing Page Editor</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Design your public landing page with live preview
            {saved && <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 text-xs">
              <CheckCircle2 className="w-3 h-3" />Saved
            </span>}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => { if (confirm('Reset to defaults?')) setState(DEFAULT_STATE) }}
            className="btn-secondary text-xs px-3 py-2 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />Reset
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary gap-2 disabled:opacity-50"
          >
            {publishing
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing...</>
              : <><Save className="w-4 h-4" />Publish</>}
          </button>
        </div>
      </div>

      {/* A11y banner */}
      {a11yIssues.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-amber-800">Accessibility issues ({a11yIssues.length})</p>
          </div>
          {a11yIssues.map((msg, i) => (
            <p key={i} className="text-xs text-amber-700 pl-6">• {msg}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Controls (2 cols) ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Background */}
          <Section icon={<ImageIcon className="w-4 h-4" />} title="Hero Background">
            <div className="flex gap-2">
              {(['gradient', 'url', 'upload'] as HeroSource[]).map((src) => (
                <button key={src} onClick={() => update('heroSource', src)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                    ${state.heroSource === src
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 ring-2 ring-indigo-200'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  {src}
                </button>
              ))}
            </div>

            {state.heroSource === 'url' && (
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="url" placeholder="https://…/hero.jpg"
                  value={state.heroUrl}
                  onChange={(e) => update('heroUrl', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white" />
              </div>
            )}

            {state.heroSource === 'upload' && (
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]) }}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-6 text-center cursor-pointer transition-colors"
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${uploading ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
                <p className="text-sm font-semibold text-slate-700">
                  {uploading ? 'Uploading…' : <>Drop image or <span className="text-indigo-600">browse</span></>}
                </p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP — up to 5MB</p>
                <input ref={fileRef} type="file" accept="image/*" hidden
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            )}
          </Section>

          {/* Color Overlay */}
          <Section icon={<Palette className="w-4 h-4" />} title="Color Overlay">
            <Row label="Color">
              <ColorInput value={state.overlayColor} onChange={(v) => update('overlayColor', v)} />
            </Row>
            <Row label={`Opacity ${Math.round(state.overlayAlpha * 100)}%`}>
              <input type="range" min={0} max={100} value={Math.round(state.overlayAlpha * 100)}
                onChange={(e) => update('overlayAlpha', Number(e.target.value) / 100)}
                className="w-full accent-indigo-600" />
            </Row>
          </Section>

          {/* Gradient */}
          <Section icon={<Sparkles className="w-4 h-4" />} title="Gradient">
            <Row label="From">
              <ColorInput value={state.gradientFrom} onChange={(v) => update('gradientFrom', v)} />
            </Row>
            <Row label="To">
              <ColorInput value={state.gradientTo} onChange={(v) => update('gradientTo', v)} />
            </Row>
            <Row label="Direction">
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(DIRECTION_ANGLES) as Direction[]).map((dir) => (
                  <button key={dir} onClick={() => update('gradientDirection', dir)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition
                      ${state.gradientDirection === dir
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {dir.replace('to-', '↗').replace('-', '')}
                  </button>
                ))}
              </div>
            </Row>
          </Section>

          {/* Content — Headline / Subtext / CTA (i18n aware) */}
          <Section icon={<Type className="w-4 h-4" />} title="Content">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              {(['en', 'ko', 'ja', 'zh'] as Lang[]).map((l) => (
                <button key={l} onClick={() => setPreviewLang(l)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition
                    ${previewLang === l ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <Row label="Headline">
              <input type="text" value={state.headlineI18n[previewLang] || ''}
                onChange={(e) => updateI18n('headlineI18n', previewLang, e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white" />
            </Row>
            <Row label="Subtext">
              <textarea rows={2} value={state.subtextI18n[previewLang] || ''}
                onChange={(e) => updateI18n('subtextI18n', previewLang, e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white resize-none" />
            </Row>
            <Row label="CTA Text">
              <input type="text" value={state.ctaTextI18n[previewLang] || ''}
                onChange={(e) => updateI18n('ctaTextI18n', previewLang, e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white" />
            </Row>

            {/* AI Generate */}
            <div className="rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 space-y-3">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                AI Copy Generator
              </div>
              <input type="text" value={brandKeywords}
                onChange={(e) => setBrandKeywords(e.target.value)}
                placeholder="brand keywords, comma separated"
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <div className="flex gap-1">
                {(['professional', 'friendly', 'bold', 'minimal'] as const).map((t) => (
                  <button key={t} onClick={() => setTone(t)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold border transition
                      ${tone === t ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-white/70 border-white/20 hover:border-white/40'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={handleAIGenerate} disabled={generating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 disabled:opacity-50">
                {generating
                  ? <><div className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Generating…</>
                  : <><Wand2 className="w-3.5 h-3.5" />Generate for 4 languages</>}
              </button>
            </div>
          </Section>

          {/* CTA styling */}
          <Section icon={<MousePointerClick className="w-4 h-4" />} title="CTA Button">
            <Row label="Color">
              <ColorInput value={state.ctaColor} onChange={(v) => update('ctaColor', v)} />
            </Row>
            <Row label="URL">
              <input type="text" value={state.ctaUrl}
                onChange={(e) => update('ctaUrl', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white" />
            </Row>
          </Section>
        </div>

        {/* ─── Live Preview (3 cols) ─────────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Eye className="w-4 h-4" />Live Preview
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Globe className="w-3.5 h-3.5" />{previewLang.toUpperCase()}
              </div>
            </div>

            {/* Hero frame */}
            <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <div className="absolute inset-0 transition-all duration-300" style={previewStyle} />
              <div className="absolute inset-0 transition-all duration-300" style={{ background: overlayRgba }} />

              <div className="relative h-full flex flex-col items-center justify-center text-center px-8 text-white">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg max-w-2xl">
                  {state.headlineI18n[previewLang] || 'Your headline here'}
                </h1>
                <p className="mt-4 text-sm md:text-lg text-white/90 max-w-xl drop-shadow">
                  {state.subtextI18n[previewLang] || 'Your subtext here'}
                </p>
                <button
                  style={{ background: state.ctaColor }}
                  className="mt-8 px-8 py-3 rounded-full text-sm md:text-base font-semibold shadow-xl hover:scale-[1.02] transition-transform"
                >
                  {state.ctaTextI18n[previewLang] || 'Get Started'}
                </button>
              </div>
            </div>

            {/* Preview meta */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <Meta label="Overlay" value={`${state.overlayColor} · ${Math.round(state.overlayAlpha * 100)}%`} />
              <Meta label="Gradient" value={`${state.gradientFrom} → ${state.gradientTo}`} />
              <Meta label="CTA" value={state.ctaColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-600 mb-1.5">{label}</p>
      {children}
    </div>
  )
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-11 h-10 rounded-lg border border-slate-200 cursor-pointer bg-white p-0.5" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300" />
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{label}</p>
      <p className="text-xs font-mono text-slate-700 truncate">{value}</p>
    </div>
  )
}
