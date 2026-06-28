import {
  Award,
  Calendar,
  CheckCircle,
  Cpu,
  CreditCard,
  FileCheck,
  FileText,
  Heart,
  Home,
  Microscope,
  Shield,
  Stethoscope,
  Users,
  Wallet,
  LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  microscope: Microscope,
  'file-check': FileCheck,
  heart: Heart,
  'check-circle': CheckCircle,
  shield: Shield,
  wallet: Wallet,
  users: Users,
  award: Award,
  cpu: Cpu,
  calendar: Calendar,
  home: Home,
  'credit-card': CreditCard,
  'file-text': FileText,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Heart
}

export function departmentColorClass(color: string): string {
  const map: Record<string, string> = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    purple: 'bg-purple text-white',
    accent: 'bg-accent text-white',
  }
  return map[color] || 'bg-secondary text-white'
}

export function departmentBorderClass(color: string): string {
  const map: Record<string, string> = {
    primary: 'border-primary/20',
    secondary: 'border-secondary/20',
    purple: 'border-purple/20',
    accent: 'border-accent/20',
  }
  return map[color] || 'border-secondary/20'
}

export function departmentButtonVariant(color: string): 'primary' | 'secondary' {
  return color === 'primary' ? 'primary' : 'secondary'
}
