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
    <div className="flex left-2 top-2 justify-between items-center px-3 bg-indigo-950 w-[480px] h-12 rounded-md overflow-hidden font-medium text-xl text-white">
      {eventLogo && <EventLogo />}
      <TeamInfo
        teamAwayName={teamAwayName ?? 'T-A'}
        teamAwayScore={10}
        teamHomeName={teamHomeName ?? 'T-H'}
        teamHomeScore={10}
        teamAwayColor={teamAwayColor ?? '#ff0000'}
        teamHomeColor={teamHomeColor ?? '#00ff00'}
      />
      <div className="flex gap-1 h-full w-full justify-between pl-2">
        <Timer value={615} />
        {/* <div className="flex h-full w-0.5 bg-white" /> */}
        <Half value={2} />
      </div>
    </div>
  )
}
