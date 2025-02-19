import * as Progress from '@radix-ui/react-progress'

type ProgressbarProps = {
  progress: string
}

const Progressbar: React.FC<ProgressbarProps> = ({ progress }) => {
  return (
    <Progress.Root
      value={
        isNaN(parseFloat(progress.replace('%', ''))) ? 100 : parseFloat(progress.replace('%', ''))
      }
      className="relative w-full h-8 bg-slate-600 rounded-lg"
    >
      <Progress.Indicator
        className="bg-slate-400 h-full rounded-lg"
        style={{ width: `${isNaN(parseFloat(progress.replace('%', ''))) ? '100%' : progress}` }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2">{progress}</div>
    </Progress.Root>
  )
}

export default Progressbar
