import React from 'react'
import MyButton from './MyButton'

type JsonPickerProps = {
  setFilePath: (filePath: string) => void
  setFileContent: (fileContent: string) => void
}

const JsonPicker: React.FC<JsonPickerProps> = ({ setFilePath, setFileContent }) => {
  const handleFilePick = async () => {
    try {
      const { ipcRenderer } = window.electron
      const filePath = await ipcRenderer.invoke('pick-json-file')
      if (filePath) {
        const fileContent = await ipcRenderer
          .invoke('read-file', filePath)
          .then((content) => JSON.stringify(content, null, 2))

        console.log('File:', { filePath, fileContent })

        setFilePath(filePath)
        setFileContent(fileContent)
      }
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  return <MyButton type="button" onClick={handleFilePick} label="Pick a JSON File" />
}

export default JsonPicker
