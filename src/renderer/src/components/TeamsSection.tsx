import { TeamsForm } from '@renderer/types/teamsForm'
import { UseFormRegister } from 'react-hook-form'
import { ColorPicker } from './ColorPicker'

type TeamsSectionProps = {
  register: UseFormRegister<TeamsForm>
  homeColor: string | undefined
  setHomeColor: (color: string | undefined) => void
  awayColor: string | undefined
  setAwayColor: (color: string | undefined) => void
}

const TeamsSection: React.FC<TeamsSectionProps> = ({
  register,
  awayColor,
  homeColor,
  setAwayColor,
  setHomeColor
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex gap-2">
        <div className="text-slate-100">Team Home:</div>
        <input {...register('teamHomeName')} />
        <ColorPicker color={homeColor ?? '#00ff00'} setColor={setHomeColor}>
          <div
            style={{ backgroundColor: homeColor ?? '#00ff00' }}
            className="flex size-7 flex-col gap-2 rounded-md border"
          />
        </ColorPicker>
      </div>

      <div className="flex gap-2">
        <div className="text-slate-100">Team Away:</div>
        <input {...register('teamAwayName')} />
        <ColorPicker color={awayColor ?? '#ff0000'} setColor={setAwayColor}>
          <div
            style={{ backgroundColor: awayColor ?? '#ff0000' }}
            className="flex size-7 flex-col gap-2 rounded-md border"
          />
        </ColorPicker>
      </div>
    </div>
  )
}

export default TeamsSection
