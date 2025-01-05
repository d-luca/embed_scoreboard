type HalfProps = {
  value: number
}

export function Half({ value }: HalfProps) {
  return <div className="flex justify-center items-center py-1 px-3 text-2xl">{value}</div>
}
