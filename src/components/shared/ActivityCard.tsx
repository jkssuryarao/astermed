import { MapPin, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import type { Activity } from '@/lib/types'

interface ActivityCardProps {
  activity: Activity
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card hover className="overflow-hidden h-full">
      <div className="h-40 bg-muted overflow-hidden">
        {activity.imageUrl ? (
          <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/40">
            <Calendar className="w-12 h-12" />
          </div>
        )}
      </div>
      <CardContent>
        <h3 className="font-semibold text-text-primary mb-2">{activity.title}</h3>
        {activity.location && (
          <p className="text-sm text-text-secondary flex items-center gap-1 mb-1">
            <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
            {activity.location}
          </p>
        )}
        {activity.date && (
          <p className="text-sm text-text-muted flex items-center gap-1">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {activity.date}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
