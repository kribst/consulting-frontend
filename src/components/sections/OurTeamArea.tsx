import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '../../components/motion/Reveal'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { apiRequest, USE_BACKEND, toMediaUrl } from '../../lib/api'
import { teamMembers } from '../../data/team'
import type { TeamMember } from '../../types'

type OurTeamAreaProps = {
  eyebrow?: string
  title?: string
  description?: string
}

export function OurTeamArea({ eyebrow, title, description }: OurTeamAreaProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<number | null>(null)

  const updateItemsPerView = useCallback(() => {
    if (typeof window === 'undefined') return
    const width = window.innerWidth
    if (width <= 600) {
      setItemsPerView(1)
    } else if (width <= 991) {
      setItemsPerView(2)
    } else if (width <= 1200) {
      setItemsPerView(3)
    } else {
      setItemsPerView(4)
    }
  }, [])

  useEffect(() => {
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [updateItemsPerView])

  useEffect(() => {
    if (!USE_BACKEND) {
      setMembers(teamMembers)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    apiRequest<{ data: TeamMember[] }>('/team')
      .then((response) => {
        if (!cancelled && response.data) {
          setMembers(response.data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Impossible de charger l\'équipe.')
          setMembers(teamMembers)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
  }, [members])

  const maxIndex = Math.max(0, members.length - itemsPerView)

  const goNext = useCallback(() => {
    setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1))
  }, [maxIndex])

  useEffect(() => {
    if (isPaused || members.length <= itemsPerView) {
      if (timerRef.current) window.clearInterval(timerRef.current)
      return
    }

    timerRef.current = window.setInterval(() => {
      goNext()
    }, 3000)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [isPaused, goNext, members.length, itemsPerView])

  function handleMouseEnter() {
    setIsPaused(true)
  }

  function handleMouseLeave() {
    setIsPaused(false)
  }

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow={eyebrow}
            title={title || 'Notre équipe'}
            description={description}
            align="center"
          />
          <p className="mt-8 text-center text-muted">Chargement...</p>
        </div>
      </section>
    )
  }

  if (error && !members.length) {
    return (
      <section className="section-padding bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Domaines d’expertise"
            title={title || 'Notre équipe'}
            description={description}
            align="center"
          />
          <p className="mt-8 text-center text-muted">{error}</p>
        </div>
      </section>
    )
  }

  if (!members.length) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Notre équipe"
            title="L'ENGAGEMENT NOTRE FORCE"
            align="center"
          />
        </Reveal>

        <div className="relative mt-12" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {members.map((member, index) => (
                <div
                  key={member.id || member.name}
                  className="w-full shrink-0 px-2 sm:px-3"
                  style={{ flexBasis: `${100 / itemsPerView}%` }}
                >
                  <Reveal delay={index * 60}>
                    <div className="mx-auto max-w-xs rounded-2xl border border-border bg-surface p-4 text-center transition hover:-translate-y-1 hover:border-gold/40 hover:bg-white hover:shadow-card">
                      <div className="mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-gray-50">
                        <img
                          src={member.image_url || toMediaUrl(member.image)}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-navy">{member.name}</h3>
                      <p className="mt-1 text-sm text-muted">{member.poste}</p>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          {members.length > itemsPerView ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="focus-ring absolute -left-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-card md:flex"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-5 w-5 text-navy" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="focus-ring absolute -right-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-card md:flex"
                aria-label="Suivant"
              >
                <ChevronRight className="h-5 w-5 text-navy" />
              </button>

              <div className="mt-8 flex justify-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={goPrev}
                  className="focus-ring rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-navy"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="focus-ring rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-navy"
                >
                  Suivant
                </button>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`focus-ring rounded-full border-none p-0 transition ${
                      i === currentIndex ? 'h-2.5 w-2.5 bg-navy' : 'h-2 w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Aller au membre ${i + 1}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
