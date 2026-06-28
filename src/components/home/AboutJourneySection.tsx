import { getIcon } from '@/lib/icons'

interface AboutJourneySectionProps {
  aboutText: string
  aboutValues: { label: string; icon: string }[]
  milestones: { year: string; text: string }[]
}

export default function AboutJourneySection({
  aboutText,
  aboutValues,
  milestones,
}: AboutJourneySectionProps) {
  return (
    <section className="section bg-muted">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">About</span>
            <h2 className="text-3xl font-bold mt-2 mb-6">ABOUT OUR CLINIC</h2>
            <p className="text-text-secondary leading-relaxed mb-8">{aboutText}</p>
            <div className="grid grid-cols-2 gap-4">
              {aboutValues.map((item) => {
                const Icon = getIcon(item.icon)
                return (
                  <div key={item.label} className="flex items-center gap-3 bg-white rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Timeline</span>
            <h2 className="text-3xl font-bold mt-2 mb-8">OUR JOURNEY</h2>
            <div className="relative">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-primary/20 hidden sm:block" />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-2">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 sm:text-center sm:flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0 relative z-10">
                      {milestone.year.slice(-2)}
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">{milestone.year}</p>
                      <p className="text-xs text-text-secondary mt-1">{milestone.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
