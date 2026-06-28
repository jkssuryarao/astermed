import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { parseBullets } from '@/lib/content'
import { departmentBorderClass, departmentColorClass } from '@/lib/icons'
import type { Department } from '@/lib/types'

interface DepartmentCardProps {
  department: Department
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  const bullets = parseBullets(department.bullets)
  const iconBg = departmentColorClass(department.color)
  const border = departmentBorderClass(department.color)
  const isPrimary = department.color === 'primary'

  return (
    <Card className={`h-full border-2 ${border}`}>
      <CardContent>
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
          <span className="text-lg font-bold">{department.name[0]}</span>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-4">{department.name}</h3>
        <ul className="space-y-2 mb-6">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        <Link href={department.ctaHref || '/services'}>
          <Button variant={isPrimary ? 'primary' : 'secondary'} fullWidth>
            {department.ctaLabel || 'Learn More'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
