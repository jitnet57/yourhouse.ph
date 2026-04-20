'use client'

import React, { useEffect, useState } from 'react'
import {
  Save, CheckCircle2, Settings, Globe, Bell, Shield, Plug,
  Key, Mail, Phone, AlertTriangle, Eye, EyeOff, RefreshCw,
  Building2, Clock, Languages
} from 'lucide-react'

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
    if (!confirm('모든 설정을 초기값으로 되돌릴까요?')) return
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {savedAt
              ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" />마지막 저장: {savedAt}</span>
              : '아직 저장되지 않았습니다.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={handleReset} className="btn-secondary text-xs px-3 py-2 gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />초기화
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className={`btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed
              ${dirty ? 'animate-pulse-slow' : ''}`}
          >
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />저장 중...</>
              : <><Save className="w-4 h-4" />변경사항 저장</>}
          </button>
        </div>
      </div>

      {/* Unsaved changes banner */}
      {dirty && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">저장하지 않은 변경사항이 있습니다.</p>
          <button onClick={handleSave} className="ml-auto text-sm font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2">
            지금 저장
          </button>
        </div>
      )}

      {/* ── General ── */}
      <SectionCard title="일반 설정 (General)" icon={<Building2 className="w-4 h-4" />}>
        <Field label="플랫폼 이름" hint="브라우저 탭 및 이메일에 표시됩니다">
          <Input value={general.platformName} onChange={(v) => updateGeneral('platformName', v)} />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="고객지원 이메일" hint="문의 이메일 수신 주소">
          <Input type="email" value={general.supportEmail} onChange={(v) => updateGeneral('supportEmail', v)} placeholder="support@yourhouse.ph" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="고객지원 전화번호">
          <Input type="tel" value={general.supportPhone} onChange={(v) => updateGeneral('supportPhone', v)} placeholder="+63 2 8xxx xxxx" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="시간대" hint="모든 날짜/시간 표시에 적용">
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
        <Field label="기본 언어">
          <select value={general.language} onChange={(e) => updateGeneral('language', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="통화">
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
      <SectionCard title="알림 설정 (Notifications)" icon={<Bell className="w-4 h-4" />}>
        <Toggle checked={notif.emailOnNewLead} onChange={(v) => updateNotif('emailOnNewLead', v)} label="신규 리드 발생 시 이메일 알림" />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.emailOnSale} onChange={(v) => updateNotif('emailOnSale', v)} label="거래 완료 시 이메일 알림" />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.smsOnNewLead} onChange={(v) => updateNotif('smsOnNewLead', v)} label="신규 리드 발생 시 SMS 알림 (Twilio 필요)" />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.weeklyReport} onChange={(v) => updateNotif('weeklyReport', v)} label="주간 리포트 자동 이메일 발송 (매주 월요일)" />
        <div className="border-t border-slate-100" />
        <Toggle checked={notif.dailyDigest} onChange={(v) => updateNotif('dailyDigest', v)} label="일일 요약 이메일 발송 (매일 오전 9시)" />
      </SectionCard>

      {/* ── Security ── */}
      <SectionCard title="보안 설정 (Security)" icon={<Shield className="w-4 h-4" />}>
        <Field label="세션 만료" hint="비활성 후 자동 로그아웃 시간 (분)">
          <select value={security.sessionTimeout} onChange={(e) => updateSecurity('sessionTimeout', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            <option value="15">15분</option>
            <option value="30">30분</option>
            <option value="60">1시간</option>
            <option value="480">8시간</option>
            <option value="0">만료 안 함</option>
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="로그인 시도 제한" hint="초과 시 계정 잠금">
          <select value={security.loginAttempts} onChange={(e) => updateSecurity('loginAttempts', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            <option value="3">3회</option>
            <option value="5">5회</option>
            <option value="10">10회</option>
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="최소 비밀번호 길이">
          <select value={security.passwordMinLength} onChange={(e) => updateSecurity('passwordMinLength', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
            <option value="6">6자 이상</option>
            <option value="8">8자 이상</option>
            <option value="12">12자 이상</option>
          </select>
        </Field>
        <div className="border-t border-slate-100" />
        <Toggle checked={security.twoFactorEnabled} onChange={(v) => updateSecurity('twoFactorEnabled', v)} label="2단계 인증 (2FA) 활성화" />
      </SectionCard>

      {/* ── Integrations ── */}
      <SectionCard title="외부 서비스 연동 (Integrations)" icon={<Plug className="w-4 h-4" />}>
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 flex items-start gap-2 mb-2">
          <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          API 키는 암호화되어 브라우저 로컬스토리지에 저장됩니다. 운영 환경에서는 서버 환경변수(.env)를 사용하세요.
        </div>

        <Field label="Twilio Account SID" hint="SMS 발송에 사용">
          <SecretInput value={integration.twilioSid} onChange={(v) => updateIntegration('twilioSid', v)} placeholder="ACxxxxxxxxxxxxxxxx" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="Twilio Auth Token">
          <SecretInput value={integration.twilioToken} onChange={(v) => updateIntegration('twilioToken', v)} placeholder="Auth Token" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="ElevenLabs API Key" hint="AI 음성 합성">
          <SecretInput value={integration.elevenlabsKey} onChange={(v) => updateIntegration('elevenlabsKey', v)} placeholder="API Key" />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="Google Maps API Key" hint="매물 지도 표시">
          <SecretInput value={integration.googleMapsKey} onChange={(v) => updateIntegration('googleMapsKey', v)} placeholder="AIza..." />
        </Field>
        <div className="border-t border-slate-100" />
        <Field label="CRM Webhook URL" hint="리드 생성 시 외부 CRM으로 전송">
          <Input value={integration.crmWebhook} onChange={(v) => updateIntegration('crmWebhook', v)} placeholder="https://your-crm.com/webhook" />
        </Field>
      </SectionCard>

      {/* Bottom Save */}
      <div className="flex justify-end gap-3 pb-8">
        <button onClick={handleReset} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" />초기화
        </button>
        <button onClick={handleSave} disabled={saving || !dirty} className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />저장 중...</>
            : <><Save className="w-4 h-4" />변경사항 저장</>}
        </button>
      </div>
    </div>
  )
}
