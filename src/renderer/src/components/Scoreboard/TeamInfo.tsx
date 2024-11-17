import { VeticalDivider } from '../VerticalDivider'

type TeamInfoProps = {
  teamHomeName: string
  teamAwayName: string
  teamHomeScore: number
  teamAwayScore: number
}

export function TeamInfo({
  teamAwayName,
  teamAwayScore,
  teamHomeName,
  teamHomeScore
}: TeamInfoProps) {
  return (
    <div className="flex gap-1 bg-slate-100 h-full px-1">
      <div className="flex gap-1 justify-between items-center">
        <div className="flex justify-center items-center">{teamHomeName}</div>
        <div className="flex justify-center items-center">{teamHomeScore}</div>
      </div>
      <div className="flex py-1 justify-center items-center">
        <VeticalDivider />
      </div>
      <div className="flex gap-1 justify-between items-center">
        <div className="flex justify-center items-center">{teamAwayScore}</div>
        <div className="flex justify-center items-center">{teamAwayName}</div>
      </div>
    </div>
  )
}
