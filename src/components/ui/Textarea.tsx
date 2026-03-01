'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  label,
  error,
  hint,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="label">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'input resize-none',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-text-muted">{hint}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
