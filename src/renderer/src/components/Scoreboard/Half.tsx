type HalfProps = {
  value: number
}

export function Half({ value }: HalfProps) {
  return <div className="flex justify-center items-center py-1 px-3 bg-slate-100">{value}</div>
}
