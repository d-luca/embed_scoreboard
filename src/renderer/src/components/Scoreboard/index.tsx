import { useState } from 'react'
import { EventLogo } from './EventLogo'
import { Half } from './Half'
import { TeamInfo } from './TeamInfo'
import { Timer } from './Timer'

type ScoreboardProps = {
  eventLogo?: string
}

export function Scoreboard({ eventLogo }: ScoreboardProps) {
  const [halfValue, setHalfValue] = useState(1)
  const [timerValue, setTimerValue] = useState(0)
  const [teamHomeName, setTeamHomeName] = useState('DRG')
  const [teamAwayName, setTeamAwayName] = useState('TIT')
  const [teamHomeScore, setTeamHomeScore] = useState(0)
  const [teamAwayScore, setTeamAwayScore] = useState(0)

  return (
    <div className="flex justify-between items-center bg-blue-950 w-72 h-8 rounded-lg overflow-hidden">
      {eventLogo && <EventLogo />}
      <TeamInfo
        teamAwayName={teamAwayName}
        teamAwayScore={teamAwayScore}
        teamHomeName={teamHomeName}
        teamHomeScore={teamHomeScore}
      />
      <Timer value={timerValue} />
      <Half value={halfValue} />
    </div>
  )
}
