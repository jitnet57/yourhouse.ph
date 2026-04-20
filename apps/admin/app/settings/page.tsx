'use client'

import React, { useEffect, useState } from 'react'
import {
  Save, CheckCircle2, Bell, Shield, Plug,
  Key, AlertTriangle, Eye, EyeOff, RefreshCw,
  Building2,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

// ─── Types ───────────────────────────────────────────────
interface GeneralSettings {
  platformName: string
  supportEmail: string
  supportPhone: string
  timezone: string
  language: string
  currency: string
}

interface NotificationSettings {
  emailOnNewLead: boolean
  emailOnSale: boolean
  smsOnNewLead: boolean
  weeklyReport: boolean
  dailyDigest: boolean
}

interface SecuritySettings {
  sessionTimeout: string
  twoFactorEnabled: boolean
  passwordMinLength: string
  loginAttempts: string
}

interface IntegrationSettings {
  twilioSid: string
  twilioToken: string
  elevenlabsKey: string
  googleMapsKey: string
  crmWebhook: string
}

// ─── Defaults ────────────────────────────────────────────
const DEFAULT_GENERAL: GeneralSettings = {
  platformName: 'K-IREA',
  supportEmail: 'support@yourhouse.ph',
  supportPhone: '+63 2 8123 4567',
  timezone: 'Asia/Manila',
  language: 'en',
  currency: 'PHP',
}
const DEFAULT_NOTIF: NotificationSettings = {
  emailOnNewLead: true,
  emailOnSale: true,
  smsOnNewLead: false,
  weeklyReport: true,
  dailyDigest: false,
}
const DEFAULT_SECURITY: SecuritySettings = {
  sessionTimeout: '30',
  twoFactorEnabled: false,
  passwordMinLength: '8',
  loginAttempts: '5',
}
const DEFAULT_INTEGRATION: IntegrationSettings = {
  twilioSid: '',
  twilioToken: '',
  elevenlabsKey: '',
  googleMapsKey: '',
  crmWebhook: '',
}

const STORAGE_KEYS = {
  general: 'kirea_settings_general',
  notif: 'kirea_settings_notif',
  security: 'kirea_settings_security',
  integration: 'kirea_settings_integration',
}

// ─── Helper ──────────────────────────────────────────────
function load<T>(key: string, defaults: T): T {
  if (typeof window === 'undefined') return defaults
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch { return defaults }
}

// ─── Sub-components ──────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 items-start">
      <div className="md:pt-2">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
    />
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 py-1 cursor-pointer group">
      <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
          ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </label>
  )
}

function SecretInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition font-mono"
      />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────
export default function SettingsPage() {
  const { t } = useLanguage()
  const s = t.settings

  const [general, setGeneral] = useState<GeneralSettings>(DEFAULT_GENERAL)
  const [notif, setNotif] = useState<NotificationSettings>(DEFAULT_NOTIF)
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY)
  const [integration, setIntegration] = useState<IntegrationSettings>(DEFAULT_INTEGRATION)

  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    setGeneral(load(STORAGE_KEYS.general, DEFAULT_GENERAL))
    setNotif(load(STORAGE_KEYS.notif, DEFAULT_NOTIF))
    setSecurity(load(STORAGE_KEYS.security, DEFAULT_SECURITY))
    setIntegration(load(STORAGE_KEYS.integration, DEFAULT_INTEGRATION))
    const ts = localStorage.getItem('kirea_settings_saved_at')
    if (ts) setSavedAt(ts)
  }, [])

  // Mark dirty on any change
  const updateGeneral = (k: keyof GeneralSettings, v: string) => {
    setGeneral((p) => ({ ...p, [k]: v }))
    setDirty(true)
  }
  const updateNotif = (k: keyof NotificationSettings, v: boolean) => {
    setNotif((p) => ({ ...p, [k]: v }))
    setDirty(true)
  }
  const updateSecurity = (k: keyof SecuritySettings, v: string | boolean) => {
    setSecurity((p) => ({ ...p, [k]: v }))
    setDirty(true)
  }
  const updateIntegration = (k: keyof IntegrationSettings, v: string) => {
    setIntegration((p) => ({ ...p, [k]: v }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    localStorage.setItem(STORAGE_KEYS.general, JSON.stringify(general))
    localStorage.setItem(STORAGE_KEYS.notif, JSON.stringify(notif))
    localStorage.setItem(STORAGE_KEYS.security, JSON.stringify(security))
    localStorage.setItem(STORAGE_KEYS.integration, JSON.stringify(integration))

    const now = new Date().toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    localStorage.setItem('kirea_settings_saved_at', now)
    setSavedAt(now)

    setSaving(false)
    setDirty(false)
  }

  const handleReset = () => {
    if (!confirm(s.resetConfirm)) return
    setGeneral(DEFAULT_GENERAL)
    setNotif(DEFAULT_NOTIF)
    setSecurity(DEFAULT_SECURITY)
    setIntegration(DEFAULT_INTEGRATION)
    setDirty(true)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{s.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {savedAt
              ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" />{s.lastSaved(savedAt)}</span>
              : s.notSaved}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={handleReset} className="btn-secondary text-xs px-3 py-2 gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />{s.resetBtn}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className={`btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed
              ${dirty ? 'animate-pulse-slow' : ''}`}
          >
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{s.saving}</>
              : <><Save className="w-4 h-4" />{s.saveBtn}</>}
          </button>
        </div>
      </div>

      {/* Unsaved changes banner */}
      {dirty && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">{s.unsavedBanner}</p>
          <button onClick={handleSave} className="ml-auto text-sm font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2">
            {s.saveNow}
          </button>
        </div>
      )}

      {/* ── General ── */}
      <SectionCard title={s.sections.general} icon={<Building2 className="w-4 h-4" />}>
        <Field label={s.general.platformName} hint={s.general.platformNameHint}>
          <Input value={general.platformName} onChange={(v) => updateGeneral('platformName', v)} />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.general.supportEmail} hint={s.general.supportEmailHint}>
          <Input type="email" value={general.supportEmail} onChange={(v) => updateGeneral('supportEmail', v)} placeholder="support@yourhouse.ph" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.general.supportPhone}>
          <Input type="tel" value={general.supportPhone} onChange={(v) => updateGeneral('supportPhone', v)} placeholder="+63 2 8xxx xxxx" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.general.timezone} hint={s.general.timezoneHint}>
          <select value={general.timezone} onChange={(e) => updateGeneral('timezone', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            <option value="Asia/Manila">Asia/Manila (UTC+8)</option>
            <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.general.language}>
          <select value={general.language} onChange={(e) => updateGeneral('language', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.general.currency}>
          <select value={general.currency} onChange={(e) => updateGeneral('currency', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            <option value="PHP">₱ Philippine Peso (PHP)</option>
            <option value="KRW">₩ Korean Won (KRW)</option>
            <option value="USD">$ US Dollar (USD)</option>
            <option value="JPY">¥ Japanese Yen (JPY)</option>
          </select>
        </Field>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard title={s.sections.notifications} icon={<Bell className="w-4 h-4" />}>
        <Toggle checked={notif.emailOnNewLead} onChange={(v) => updateNotif('emailOnNewLead', v)} label={s.notif.emailOnNewLead} />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.emailOnSale} onChange={(v) => updateNotif('emailOnSale', v)} label={s.notif.emailOnSale} />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.smsOnNewLead} onChange={(v) => updateNotif('smsOnNewLead', v)} label={s.notif.smsOnNewLead} />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.weeklyReport} onChange={(v) => updateNotif('weeklyReport', v)} label={s.notif.weeklyReport} />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.dailyDigest} onChange={(v) => updateNotif('dailyDigest', v)} label={s.notif.dailyDigest} />
      </SectionCard>

      {/* ── Security ── */}
      <SectionCard title={s.sections.security} icon={<Shield className="w-4 h-4" />}>
        <Field label={s.security.sessionTimeout} hint={s.security.sessionTimeoutHint}>
          <select value={security.sessionTimeout} onChange={(e) => updateSecurity('sessionTimeout', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            {(Object.entries(s.timeouts) as [string, string][]).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.security.loginAttempts} hint={s.security.loginAttemptsHint}>
          <select value={security.loginAttempts} onChange={(e) => updateSecurity('loginAttempts', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            {(Object.entries(s.attempts) as [string, string][]).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.security.passwordLength}>
          <select value={security.passwordMinLength} onChange={(e) => updateSecurity('passwordMinLength', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            {(Object.entries(s.lengths) as [string, string][]).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Toggle checked={security.twoFactorEnabled} onChange={(v) => updateSecurity('twoFactorEnabled', v)} label={s.security.twoFactor} />
      </SectionCard>

      {/* ── Integrations ── */}
      <SectionCard title={s.sections.integrations} icon={<Plug className="w-4 h-4" />}>
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 flex items-start gap-2 mb-2">
          <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          {s.integration.apiKeyNote}
        </div>

        <Field label={s.integration.twilioSid} hint={s.integration.twilioSidHint}>
          <SecretInput value={integration.twilioSid} onChange={(v) => updateIntegration('twilioSid', v)} placeholder="ACxxxxxxxxxxxxxxxx" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.integration.twilioToken}>
          <SecretInput value={integration.twilioToken} onChange={(v) => updateIntegration('twilioToken', v)} placeholder="Auth Token" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.integration.elevenlabs} hint={s.integration.elevenlabsHint}>
          <SecretInput value={integration.elevenlabsKey} onChange={(v) => updateIntegration('elevenlabsKey', v)} placeholder="API Key" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.integration.googleMaps} hint={s.integration.googleMapsHint}>
          <SecretInput value={integration.googleMapsKey} onChange={(v) => updateIntegration('googleMapsKey', v)} placeholder="AIza..." />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label={s.integration.crmWebhook} hint={s.integration.crmWebhookHint}>
          <Input value={integration.crmWebhook} onChange={(v) => updateIntegration('crmWebhook', v)} placeholder="https://your-crm.com/webhook" />
        </Field>
      </SectionCard>

      {/* Bottom Save */}
      <div className="flex justify-end gap-3 pb-8">
        <button onClick={handleReset} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" />{s.resetBtn}
        </button>
        <button onClick={handleSave} disabled={saving || !dirty} className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{s.saving}</>
            : <><Save className="w-4 h-4" />{s.saveBtn}</>}
        </button>
      </div>
    </div>
  )
}
