import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ActivityCard from '@/components/shared/ActivityCard'
import type { Activity } from '@/lib/types'

interface ActivitiesPreviewSectionProps {
  activities: Activity[]
  limit?: number
}

export default function ActivitiesPreviewSection({
  activities,
  limit = 6,
}: ActivitiesPreviewSectionProps) {
  const preview = activities.slice(0, limit)

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">OUR ACTIVITIES / HEALTH CAMPS</h2>
          <Link href="/activities" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View All Activities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {preview.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            Health camp and activity updates will be posted here soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
