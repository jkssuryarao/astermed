'use client'

import { forwardRef, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  error,
  hint,
  options,
  placeholder,
  id,
  ...props
}, ref) => {
  const selectId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'input appearance-none pr-10',
            error && 'input-error',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-text-muted">{hint}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
