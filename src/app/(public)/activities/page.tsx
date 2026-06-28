import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ActivityCard from '@/components/shared/ActivityCard'
import { getActivities } from '@/lib/content'

export const revalidate = 60

export default async function ActivitiesPage() {
  const activities = await getActivities()

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <Link href="/" className="inline-flex items-center text-primary text-sm font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Activities / Health Camps</h1>
        <p className="text-text-secondary mb-12 max-w-2xl">
          Community health initiatives and camps organized by our clinic.
        </p>

        {activities.length === 0 ? (
          <div className="text-center py-20 bg-muted rounded-2xl">
            <p className="text-text-secondary">No activities posted yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
