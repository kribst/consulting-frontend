import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { SiteContent } from '../../types'
import { defaultSiteContent } from './defaultSiteContent'
import { fetchSiteContent, mergeSiteContent, persistSiteContent, resetStoredSiteContent, writeStoredSiteContent } from './siteContentStorage'

type SiteContentContextValue = {
  content: SiteContent
  isLoading: boolean
  error: string
  updateContent: (nextContent: SiteContent) => void
  saveContent: (nextContent: SiteContent) => Promise<void>
  resetContent: () => Promise<void>
  refreshContent: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => mergeSiteContent(defaultSiteContent))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshContent = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const nextContent = await fetchSiteContent()
      setContent(nextContent)
      writeStoredSiteContent(nextContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger le contenu du site.')
      setContent(mergeSiteContent(defaultSiteContent))
    } finally {
      setIsLoading(false)
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
    () => ({ content, isLoading, error, updateContent, saveContent, resetContent, refreshContent }),
    [content, isLoading, error, refreshContent],
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
