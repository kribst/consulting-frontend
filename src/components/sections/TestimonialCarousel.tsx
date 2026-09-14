import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '../../components/motion/Reveal'
import { TestimonialCard } from '../../components/cards/TestimonialCard'
import type { Testimonial } from '../../types'

type TestimonialCarouselProps = {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  const updateItemsPerView = useCallback(() => {
    if (typeof window === 'undefined') return
    const width = window.innerWidth
    if (width < 768) {
      setItemsPerView(1)
    } else if (width < 1024) {
      setItemsPerView(2)
    } else {
      setItemsPerView(3)
    }
  }, [])

  useEffect(() => {
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [updateItemsPerView])

  useEffect(() => {
    setCurrentIndex(0)
  }, [testimonials])

  const maxIndex = Math.max(0, testimonials.length - itemsPerView)

  const goNext = useCallback(() => {
    setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1))
  }, [maxIndex])

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) window.clearInterval(timerRef.current)
      return
    }

    timerRef.current = window.setInterval(() => {
      goNext()
    }, 3000)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [isPaused, goNext])

  function handleMouseEnter() {
    setIsPaused(true)
  }

  function handleMouseLeave() {
    setIsPaused(false)
  }

  if (!testimonials.length) return null

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id || testimonial.name} className="w-full shrink-0 px-1.5" style={{ flexBasis: `${100 / itemsPerView}%` }}>
              <Reveal delay={index * 60}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {testimonials.length > itemsPerView ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="focus-ring absolute -left-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-card md:flex"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="focus-ring absolute -right-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-card md:flex"
            aria-label="Témoignage suivant"
          >
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>
          <div className="mt-6 flex justify-center gap-2 md:hidden">
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
        </>
      ) : null}
    </div>
  )
}
