import JsonSection from '@renderer/components/JsonSection'
import MyButton from '@renderer/components/MyButton'
import VideoSection from '@renderer/components/VideoSection'
import { useState } from 'react'

export function MainPage() {
  const [teamsPath, setTeamsPath] = useState<string | undefined>(undefined)
  const [teamsContent, setTeamsContent] = useState<string | undefined>(undefined)
  const [scoresPath, setScoresPath] = useState<string | undefined>(undefined)
  const [scoresContent, setScoresContent] = useState<string | undefined>(undefined)
  const [videoPath, setVideoPath] = useState<string | undefined>(undefined)

  const handleCopyFile = async () => {
    try {
      const { ipcRenderer } = window.electron
      const result = await ipcRenderer.invoke(
        'copy-file',
        teamsPath,
        './public/rendering-assets/match-teams.json'
      )
      if (result.success) {
        console.log('File copied successfully')
      } else {
        console.error('Error copying file:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    try {
      const { ipcRenderer } = window.electron
      const result = await ipcRenderer.invoke(
        'copy-file',
        scoresPath,
        './public/rendering-assets/match-score.json'
      )
      if (result.success) {
        console.log('File copied successfully')
      } else {
        console.error('Error copying file:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    try {
      const { ipcRenderer } = window.electron
      const result = await ipcRenderer.invoke(
        'copy-file',
        videoPath,
        './public/rendering-assets/match-video.mp4'
      )
      if (result.success) {
        console.log('File copied successfully')
      } else {
        console.error('Error copying file:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-slate-950">
      <div className="flex flex-col size-full gap-2">
        <JsonSection
          fileType="Teams"
          filePath={teamsPath}
          fileContent={teamsContent}
          setFilePath={setTeamsPath}
          setFileContent={setTeamsContent}
        />
        <JsonSection
          fileType="Scores"
          filePath={scoresPath}
          fileContent={scoresContent}
          setFilePath={setScoresPath}
          setFileContent={setScoresContent}
        />
        <VideoSection fileType="Video" filePath={videoPath} setFilePath={setVideoPath} />
        <MyButton onClick={handleCopyFile} label="Start Rendering" />
      </div>
    </div>
  )
}
