import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import type { DoctorProfile } from '@/lib/types'

interface DoctorCardProps {
  doctor: DoctorProfile
  compact?: boolean
}

export default function DoctorCard({ doctor, compact }: DoctorCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted mb-4">
          {doctor.photoUrl ? (
            <img src={doctor.photoUrl} alt={doctor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
              {doctor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
          )}
        </div>
        <h3 className="font-semibold text-text-primary">{doctor.name}</h3>
        <p className="text-sm text-secondary font-medium">{doctor.qualifications}</p>
        <p className="text-sm text-text-secondary mt-1">{doctor.specialty}</p>
        {doctor.experienceYears && (
          <p className="text-xs text-text-muted mt-1">{doctor.experienceYears} years experience</p>
        )}
        {doctor.availability && (
          <p className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {doctor.availability}
          </p>
        )}
        {!compact && doctor.bio && (
          <p className="text-sm text-text-secondary mt-3 line-clamp-2">{doctor.bio}</p>
        )}
        <Link href="/appointment" className="block mt-4">
          <Button size="sm" fullWidth>
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
