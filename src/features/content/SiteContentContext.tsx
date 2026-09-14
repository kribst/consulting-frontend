import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { SiteContent } from '../../types'
import { defaultSiteContent } from './defaultSiteContent'
import { fetchSiteContent, mergeSiteContent, persistSiteContent, readStoredSiteContent, resetStoredSiteContent, writeStoredSiteContent } from './siteContentStorage'

type SiteContentContextValue = {
  content: SiteContent
  error: string
  updateContent: (nextContent: SiteContent) => void
  saveContent: (nextContent: SiteContent) => Promise<void>
  resetContent: () => Promise<void>
  refreshContent: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => readStoredSiteContent())
  const [error, setError] = useState('')

  const refreshContent = useCallback(async () => {
    try {
      const nextContent = await fetchSiteContent()
      setContent(nextContent)
      writeStoredSiteContent(nextContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger le contenu du site.')
    }
  }, [])

  useEffect(() => {
    void refreshContent()
  }, [refreshContent])

  function updateContent(nextContent: SiteContent) {
    const merged = mergeSiteContent(nextContent)
    setContent(merged)
    writeStoredSiteContent(merged)
  }

  async function saveContent(nextContent: SiteContent) {
    const saved = await persistSiteContent(nextContent)
    setContent(saved)
  }

  async function resetContent() {
    resetStoredSiteContent()
    const nextContent = mergeSiteContent(defaultSiteContent)
    await persistSiteContent(nextContent)
    setContent(nextContent)
  }

  const value = useMemo(
    () => ({ content, error, updateContent, saveContent, resetContent, refreshContent }),
    [content, error, refreshContent],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  const context = useContext(SiteContentContext)
  if (!context) {
    throw new Error('useSiteContent must be used inside SiteContentProvider')
  }
  return context
}
