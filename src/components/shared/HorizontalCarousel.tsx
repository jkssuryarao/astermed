'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HorizontalCarouselProps {
  children: ReactNode[]
  className?: string
  itemClassName?: string
}

export default function HorizontalCarousel({
  children,
  className,
  itemClassName = 'min-w-[280px] sm:min-w-[300px]',
}: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [children.length])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  if (children.length === 0) return null

  return (
    <div className={cn('relative', className)}>
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-elevated flex items-center justify-center hover:bg-muted transition-colors -ml-2"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-elevated flex items-center justify-center hover:bg-muted transition-colors -mr-2"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children.map((child, i) => (
          <div key={i} className={cn('snap-start flex-shrink-0', itemClassName)}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
