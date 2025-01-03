type MyButtonProps = {
  label: string
  onClick: () => void
}

const MyButton: React.FC<MyButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick} className="rounded-lg bg-slate-400">
      {label}
    </button>
  )
}

export default MyButton
