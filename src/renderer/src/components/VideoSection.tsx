import VideoPicker from './VideoPicker'

type VideoSectionProps = {
  fileType: string
  filePath: string | undefined
  // fileContent: string | undefined
  setFilePath: (filePath: string) => void
  // setFileContent: (fileContent: string) => void
}

const VideoSection: React.FC<VideoSectionProps> = ({
  fileType,
  filePath,
  // fileContent,
  setFilePath
  // setFileContent
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1 w-1/2">
        <div className="flex gap-1 text-slate-100">
          {`${fileType} File: ${filePath ?? 'No file selected'}`}
        </div>
        <VideoPicker setFilePath={setFilePath} />
      </div>
      {/* <span className="flex w-1/2 max-h-32 overflow-auto text-slate-100"> {fileContent} </span> */}
    </div>
  )
}

export default VideoSection
