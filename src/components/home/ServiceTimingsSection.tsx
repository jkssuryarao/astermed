import { getIcon } from '@/lib/icons'
import { Card, CardContent } from '@/components/ui/Card'
import type { ServiceTiming } from '@/lib/types'

interface ServiceTimingsSectionProps {
  timings: ServiceTiming[]
  values: { label: string; icon: string }[]
}

export default function ServiceTimingsSection({ timings, values }: ServiceTimingsSectionProps) {
  return (
    <section className="section bg-muted">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Hours</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">SERVICE TIMINGS</h2>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
            {timings.map((timing) => (
              <Card key={timing.id}>
                <CardContent>
                  <h3 className="text-lg font-semibold text-primary mb-4">{timing.department}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-text-primary">{timing.weekdayLabel}</p>
                      <p className="text-text-secondary">{timing.weekdayHours}</p>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Sunday</p>
                      <p className="text-text-secondary">{timing.sundayHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            {values.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <div key={item.label} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-card">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-medium text-text-primary text-sm">{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
