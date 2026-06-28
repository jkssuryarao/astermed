import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BRAND } from '@/lib/brand'

type LogoVariant = 'full' | 'compact' | 'icon'
type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  href?: string
  className?: string
  light?: boolean
}

const imageSizes: Record<LogoSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

const titleClasses: Record<LogoSize, string> = {
  sm: 'text-xs sm:text-sm font-bold leading-tight',
  md: 'text-sm sm:text-base font-bold leading-tight',
  lg: 'text-base sm:text-xl font-bold leading-tight',
}

const taglineClasses: Record<LogoSize, string> = {
  sm: 'text-[10px] sm:text-xs',
  md: 'text-xs sm:text-sm',
  lg: 'text-sm',
}

export default function Logo({
  variant = 'full',
  size = 'md',
  href,
  className,
  light = false,
}: LogoProps) {
  const imageSize = imageSizes[size]

  const content = (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
      <div
        className={cn(
          'relative flex-shrink-0 rounded-lg overflow-hidden bg-white',
          size === 'sm' && 'w-8 h-8',
          size === 'md' && 'w-8 h-8 sm:w-10 sm:h-10',
          size === 'lg' && 'w-10 h-10 sm:w-12 sm:h-12'
        )}
      >
        <Image
          src={BRAND.logo}
          alt={BRAND.shortName}
          width={imageSize}
          height={imageSize}
          className="object-contain p-0.5"
          priority
        />
      </div>

      {variant !== 'icon' && (
        <div className="min-w-0 max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-none">
          <p
            className={cn(
              titleClasses[size],
              light ? 'text-white' : 'text-primary'
            )}
          >
            {BRAND.title}
          </p>
          {variant === 'full' && (
            <p
              className={cn(
                taglineClasses[size],
                light ? 'text-white/70' : 'text-text-secondary'
              )}
            >
              {BRAND.tagline}
            </p>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
