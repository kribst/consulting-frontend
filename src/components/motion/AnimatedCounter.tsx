import { useEffect, useMemo, useRef, useState } from 'react'

type AnimatedCounterProps = {
  value: string
  duration?: number
  className?: string
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

export function AnimatedCounter({ value, duration = 1100, className = '' }: AnimatedCounterProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [displayValue, setDisplayValue] = useState('0')

  const numericValue = useMemo(() => Number(value.replace(/[^0-9.]/g, '')), [value])
  const suffix = useMemo(() => value.replace(/[0-9.,\s]/g, ''), [value])
  const canAnimate = Number.isFinite(numericValue) && numericValue > 0

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !canAnimate || !('IntersectionObserver' in window)) {
      setDisplayValue(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.45 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [canAnimate, value])

  useEffect(() => {
    if (!hasStarted || !canAnimate) return

    let animationFrame = 0
    const startTime = performance.now()

    function tick(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const nextValue = Math.round(numericValue * eased)
      setDisplayValue(`${nextValue.toLocaleString('fr-FR')}${suffix}`)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrame)
  }, [canAnimate, duration, hasStarted, numericValue, suffix])

  return (
    <span ref={elementRef} className={className}>
      {canAnimate ? displayValue : value}
    </span>
  )
}
