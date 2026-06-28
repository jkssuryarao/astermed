import { getHomePageData } from '@/lib/content'
import HeroSection from '@/components/home/HeroSection'
import DepartmentsSection from '@/components/home/DepartmentsSection'
import ServiceTimingsSection from '@/components/home/ServiceTimingsSection'
import DoctorsCarouselSection from '@/components/home/DoctorsCarouselSection'
import BookingLabSection from '@/components/home/BookingLabSection'
import ActivitiesPreviewSection from '@/components/home/ActivitiesPreviewSection'
import AboutJourneySection from '@/components/home/AboutJourneySection'
import BoardMembersPreviewSection from '@/components/home/BoardMembersPreviewSection'

export const revalidate = 60

export default async function HomePage() {
  const data = await getHomePageData()

  return (
    <>
      <HeroSection
        title={data.hero.title}
        tagline={data.hero.tagline}
        subtitle={data.hero.subtitle}
        values={data.hero.values}
        settings={data.settings}
      />
      <DepartmentsSection departments={data.departments} />
      <ServiceTimingsSection timings={data.serviceTimings} values={data.timingsValues} />
      <DoctorsCarouselSection doctors={data.doctors} />
      <BookingLabSection
        settings={data.settings}
        popularTests={data.lab.popularTests}
        processSteps={data.lab.processSteps}
      />
      <ActivitiesPreviewSection activities={data.activities} />
      <AboutJourneySection
        aboutText={data.about.text}
        aboutValues={data.about.values}
        milestones={data.journey}
      />
      <BoardMembersPreviewSection boardMembers={data.boardMembers} />
    </>
  )
}
