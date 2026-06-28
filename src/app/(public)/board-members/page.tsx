import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BoardMemberCard from '@/components/shared/BoardMemberCard'
import { getBoardMembers } from '@/lib/content'

export const revalidate = 60

export default async function BoardMembersPage() {
  const boardMembers = await getBoardMembers()

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <Link href="/" className="inline-flex items-center text-primary text-sm font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Board Members</h1>
        <p className="text-text-secondary mb-12 max-w-2xl">
          Leadership guiding our commitment to quality healthcare.
        </p>

        {boardMembers.length === 0 ? (
          <div className="text-center py-20 bg-muted rounded-2xl">
            <p className="text-text-secondary">Board member profiles will be added soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {boardMembers.map((member) => (
              <BoardMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
