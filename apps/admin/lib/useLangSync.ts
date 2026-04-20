'use client'

import { useCallback, useRef } from 'react'
import { useLanguage, Lang } from '@/lib/i18n'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Placeholder: replace with real auth user ID from your auth system
function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'anonymous'
  return localStorage.getItem('kirea_user_id') || 'anonymous'
}

// Collect content keys that are currently rendered on screen.
// Keys follow the pattern: "{type}.{id}.{field}"
// e.g. "property.42.title", "lead.7.description"
// These are registered via POST /api/lang-sync/content when content is created.
function getVisibleContentKeys(): string[] {
  if (typeof document === 'undefined') return []
  const els = document.querySelectorAll<HTMLElement>('[data-content-key]')
  return Array.from(els)
    .map((el) => el.dataset.contentKey ?? '')
    .filter(Boolean)
}

export function useLangSync() {
  const { lang, setLang } = useLanguage()
  const pendingRef = useRef(false)

  const changeLang = useCallback(async (newLang: Lang) => {
    if (newLang === lang || pendingRef.current) return
    pendingRef.current = true

    // 1. Optimistic UI update — instant, no flicker
    setLang(newLang)

    // 2. Persist lang preference to localStorage for SSR hydration
    if (typeof window !== 'undefined') {
      localStorage.setItem('kirea_lang', newLang)
    }

    // 3. Call LangGraph sync endpoint (fire-and-forget style for UX)
    try {
      const contentKeys = getVisibleContentKeys()
      const res = await fetch(`${API_BASE}/api/lang-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getCurrentUserId(),
          requested_lang: newLang,
          previous_lang: lang,
          content_keys: contentKeys,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        // Apply translated content to data-content-key elements
        if (data.translated_content && typeof document !== 'undefined') {
          Object.entries(data.translated_content as Record<string, string>).forEach(
            ([key, text]) => {
              const el = document.querySelector<HTMLElement>(
                `[data-content-key="${key}"]`
              )
              if (el) el.textContent = text
            }
          )
        }
        console.info(
          `[langSync] ${lang}→${newLang} | hits:${data.cache_hits} misses:${data.cache_misses}`
        )
      }
    } catch (err) {
      // Non-critical: UI already updated optimistically
      console.warn('[langSync] API call failed (UI still updated):', err)
    } finally {
      pendingRef.current = false
    }
  }, [lang, setLang])

  return { lang, changeLang }
}
