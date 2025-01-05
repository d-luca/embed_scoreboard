type TimerProps = {
  value: number
}

export function Timer({ value }: TimerProps) {
  return (
    <div className="flex justify-center items-center py-1 px-3 text-2xl">
      {`${Math.floor(value / 60)
        .toString()
        .padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`}
    </div>
  )
}
