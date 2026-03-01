'use client'

import { Fragment, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        <div
          className={cn(
            'relative w-full bg-white rounded-2xl shadow-xl transform transition-all animate-scale-in',
            sizes[size]
          )}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                {title && (
                  <h3 className="text-xl font-semibold text-text-primary">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {description}
                  </p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-2 -m-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
