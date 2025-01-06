type HalfProps = {
  value: number
}

export function Half({ value }: HalfProps) {
  return (
    <div className="flex justify-center items-center text-2xl font-bold bg-white text-neutral-950 px-3 mr-1">
      {value}
    </div>
  )
}
