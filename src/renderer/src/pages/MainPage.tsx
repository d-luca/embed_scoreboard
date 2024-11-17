import FilePicker from '@renderer/components/FilePicker'
import { Scoreboard } from '@renderer/components/Scoreboard'

export function MainPage() {
  return (
    <div className="flex flex-col w-screen h-screen bg-slate-950">
      <div className="flex w-full">Test</div>
      <FilePicker />
      <Scoreboard />
    </div>
  )
}
