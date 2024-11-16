import React from 'react'

const FilePicker: React.FC = () => {
  const handleFilePick = async () => {
    try {
      const { ipcRenderer } = window.electron
      const filePath = await ipcRenderer.invoke('pick-file')
      if (filePath) {
        const fileContent = await ipcRenderer.invoke('read-file', filePath)
        console.log('File Content:', fileContent)
      }
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  return <button onClick={handleFilePick}>Pick a JSON File</button>
}

export default FilePicker
