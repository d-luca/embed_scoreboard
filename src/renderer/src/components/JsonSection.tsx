import JsonPicker from './JsonPicker'

type JsonSectionProps = {
  fileType: string
  filePath: string | undefined
  fileContent: string | undefined
  setFilePath: (filePath: string) => void
  setFileContent: (fileContent: string) => void
}

const JsonSection: React.FC<JsonSectionProps> = ({
  fileType,
  filePath,
  fileContent,
  setFilePath,
  setFileContent
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1 w-1/2">
        <div className="flex gap-1 text-slate-100">
          {`${fileType} File: ${filePath ?? 'No file selected'}`}
        </div>
        <JsonPicker setFileContent={setFileContent} setFilePath={setFilePath} />
      </div>
      <span className="flex w-1/2 min-h-20 max-h-40 overflow-auto bg-slate-800 text-slate-100 rounded-md px-3 py-2">
        {fileContent ?? 'No Data'}
      </span>
    </div>
  )
}

export default JsonSection
