type TeamColorReactProps = {
  color: string
}

export function TeamColorRect({ color }: TeamColorReactProps) {
  return <div className="w-2 h-full" style={{ backgroundColor: color ?? '#ffffff' }} />
}
