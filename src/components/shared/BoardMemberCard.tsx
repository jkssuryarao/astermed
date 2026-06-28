import { Card, CardContent } from '@/components/ui/Card'
import type { BoardMember } from '@/lib/types'

interface BoardMemberCardProps {
  member: BoardMember
}

export default function BoardMemberCard({ member }: BoardMemberCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted mb-4">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
              {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
          )}
        </div>
        <h3 className="font-semibold text-text-primary">{member.name}</h3>
        <p className="text-sm text-secondary font-medium">{member.designation}</p>
        {member.qualifications && (
          <p className="text-sm text-text-secondary mt-1">{member.qualifications}</p>
        )}
        {member.experienceYears && (
          <p className="text-xs text-text-muted mt-2">{member.experienceYears} years experience</p>
        )}
      </CardContent>
    </Card>
  )
}
