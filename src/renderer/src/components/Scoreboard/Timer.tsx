type TimerProps = {
  value: number
}

export function Timer({ value }: TimerProps) {
  return <div className="flex justify-center items-center py-1 px-3 bg-slate-100">{value}</div>
}
