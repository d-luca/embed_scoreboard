import { TeamsData } from '@renderer/types/teamsForm'
import { EventLogo } from './EventLogo'
import { Half } from './Half'
import { TeamInfo } from './TeamInfo'
import { Timer } from './Timer'

type ScoreboardProps = TeamsData & {
  eventLogo?: string
}

export function Scoreboard({
  eventLogo,
  teamAwayColor,
  teamAwayName,
  teamHomeColor,
  teamHomeName
}: ScoreboardProps) {
  return (
    <div className="flex justify-between items-center px-3 bg-indigo-950 w-[420px] h-12 rounded-md overflow-hidden font-medium text-xl text-white">
      {eventLogo && <EventLogo />}
      <TeamInfo
        teamAwayName={teamAwayName ?? 'T-A'}
        teamAwayScore={10}
        teamHomeName={teamHomeName ?? 'T-H'}
        teamHomeScore={10}
        teamAwayColor={teamAwayColor ?? '#ff0000'}
        teamHomeColor={teamHomeColor ?? '#00ff00'}
      />
      <Timer value={15} />
      <Half value={2} />
    </div>
  )
}
