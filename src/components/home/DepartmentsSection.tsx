import DepartmentCard from '@/components/shared/DepartmentCard'
import type { Department } from '@/lib/types'

interface DepartmentsSectionProps {
  departments: Department[]
}

export default function DepartmentsSection({ departments }: DepartmentsSectionProps) {
  return (
    <section className="section bg-white" id="services">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">OUR SERVICES</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      </div>
    </section>
  )
}
