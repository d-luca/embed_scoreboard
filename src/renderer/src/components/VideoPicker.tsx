import React from 'react'
import MyButton from './MyButton'

type VideoPickerProps = {
  setFilePath: (filePath: string) => void
  // setFileContent: (fileContent: string) => void
}

const VideoPicker: React.FC<VideoPickerProps> = ({ setFilePath }) => {
  const handleFilePick = async () => {
    try {
      const { ipcRenderer } = window.electron
      const filePath = await ipcRenderer.invoke('pick-video-file')
      // if (filePath) {
      //   const fileContent = await ipcRenderer
      //     .invoke('read-file', filePath)
      //     .then((content) => JSON.stringify(content, null, 2))

      //   console.log('File:', { filePath, fileContent })

      //   // setFileContent(fileContent)
      // }
      setFilePath(filePath)
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  return <MyButton onClick={handleFilePick} label="Pick a Video File" />
}

export default VideoPicker
