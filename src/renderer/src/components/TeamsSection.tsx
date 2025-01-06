import { ColorPicker } from './ColorPicker'
import MyInput from './MyInput'

type TeamsSectionProps = {
  homeColor: string | undefined
  setHomeColor: (color: string | undefined) => void
  awayColor: string | undefined
  setAwayColor: (color: string | undefined) => void
  homeName: string | undefined
  setHomeName: (name: string | undefined) => void
  awayName: string | undefined
  setAwayName: (name: string | undefined) => void
  outputName: string | undefined
  setOutputName: (name: string | undefined) => void
}

const TeamsSection: React.FC<TeamsSectionProps> = ({
  awayColor,
  homeColor,
  setAwayColor,
  setHomeColor,
  setAwayName,
  setHomeName,
  homeName,
  awayName,
  outputName,
  setOutputName
}) => {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFunction: (name: string | undefined) => void
  ) => {
    setFunction(event.target.value)
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 items-center">
        <div className="text-slate-100 w-36">Team Home:</div>
        <MyInput
          value={homeName}
          onChange={(e) => {
            handleInputChange(e, setHomeName)
          }}
        />
        <ColorPicker color={homeColor ?? '#00ff00'} setColor={setHomeColor}>
          <div
            style={{ backgroundColor: homeColor ?? '#00ff00' }}
            className="flex size-7 flex-col gap-2 rounded-md border"
          />
        </ColorPicker>
      </div>

      <div className="flex gap-2 items-center">
        <div className="text-slate-100 w-36">Team Away:</div>
        <MyInput
          value={awayName}
          onChange={(e) => {
            handleInputChange(e, setAwayName)
          }}
        />
        <ColorPicker color={awayColor ?? '#ff0000'} setColor={setAwayColor}>
          <div
            style={{ backgroundColor: awayColor ?? '#ff0000' }}
            className="flex size-7 flex-col gap-2 rounded-md border"
          />
        </ColorPicker>
      </div>

      <div className="flex gap-2 items-center">
        <div className="text-slate-100 w-36">Output name:</div>
        <MyInput
          value={outputName}
          onChange={(e) => {
            handleInputChange(e, setOutputName)
          }}
        />
      </div>
    </div>
  )
}

export default TeamsSection
