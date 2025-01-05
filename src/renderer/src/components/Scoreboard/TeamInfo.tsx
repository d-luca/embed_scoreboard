import { VeticalDivider } from '../VerticalDivider'
import { TeamColorRect } from './TeamColorRect'

type TeamInfoProps = {
  teamHomeName: string
  teamAwayName: string
  teamAwayColor: string
  teamHomeScore: number
  teamAwayScore: number
  teamHomeColor: string
}

export function TeamInfo({
  teamAwayName,
  teamAwayScore,
  teamAwayColor,
  teamHomeName,
  teamHomeScore,
  teamHomeColor
}: TeamInfoProps) {
  return (
    <div className="flex gap-3 h-full px-1">
      <div className="flex gap-2 justify-between items-center">
        <TeamColorRect color={teamHomeColor} />
        <div className="flex w-12 justify-center items-center">{teamHomeName}</div>
      </div>

      <div className="flex py-1 bg-white items-center text-neutral-950 text-2xl">
        <div className="flex w-12 bg-white justify-center items-center">{teamHomeScore}</div>
        <VeticalDivider />
        <div className="flex w-12 bg-white justify-center items-center">{teamAwayScore}</div>
      </div>

      <div className="flex gap-2 justify-between items-center">
        <div className="flex w-12 justify-center items-center">{teamAwayName}</div>
        <TeamColorRect color={teamAwayColor} />
      </div>
    </div>
  )
}
