import { ComponentProps } from 'react'

type MyButtonProps = ComponentProps<'button'> & {
  label: string
}

const MyButton: React.FC<MyButtonProps> = (props) => {
  return (
    <button {...props} onClick={props.onClick} className="rounded-lg bg-slate-400">
      {props.label}
    </button>
  )
}

export default MyButton
