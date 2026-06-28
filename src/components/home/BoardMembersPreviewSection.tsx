import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import BoardMemberCard from '@/components/shared/BoardMemberCard'
import HorizontalCarousel from '@/components/shared/HorizontalCarousel'
import type { BoardMember } from '@/lib/types'

interface BoardMembersPreviewSectionProps {
  boardMembers: BoardMember[]
}

export default function BoardMembersPreviewSection({ boardMembers }: BoardMembersPreviewSectionProps) {
  if (boardMembers.length === 0) {
    return (
      <section className="section bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">OUR BOARD MEMBERS</h2>
          <p className="text-text-secondary mb-6">Board member profiles will be added soon.</p>
          <Link href="/board-members" className="text-primary font-medium hover:underline">
            View Board Members Page
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">OUR BOARD MEMBERS</h2>
          <Link href="/board-members" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View All Members <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <HorizontalCarousel>
          {boardMembers.map((member) => (
            <BoardMemberCard key={member.id} member={member} />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  )
}
