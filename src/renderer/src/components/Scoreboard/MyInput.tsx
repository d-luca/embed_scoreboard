import { ComponentProps } from 'react'

type MyInputProps = ComponentProps<'input'>

const MyInput: React.FC<MyInputProps> = (props) => {
  return <input {...props} className="px-2 py-1 bg-slate-400 rounded-lg outline-none" />
}

export default MyInput
