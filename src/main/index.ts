import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'fs/promises'
import { exec } from 'child_process'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    maxWidth: 1080,
    maxHeight: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('pick-json-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

ipcMain.handle('pick-video-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Video Files', extensions: ['mp4'] }]
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

ipcMain.handle('read-file', async (_, filePath) => {
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
})

ipcMain.handle('copy-file', async (_, sourcePath, destinationPath) => {
  try {
    const destinationDir = join(destinationPath, '..')
    console.log(destinationDir)
    await fs.mkdir(destinationDir, { recursive: true })
    await fs.copyFile(sourcePath, destinationPath)
    return { success: true }
  } catch (error) {
    console.error('Error copying file:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('run-docker-container', async (_, outputName) => {
  const appPath = app.getAppPath()
  console.log(appPath)

  return new Promise((resolve, reject) => {
    const command = `docker run --name scoreboard_renderer -v ${appPath}/public/rendering-assets:/public -v ${appPath}/out:/out scoreboard:prod /bin/sh -c "npx remotion render --output /out/${outputName}.mp4 --concurrency 100% && while true; do echo 'Rendering has finished'; sleep 0.5; done"`
    exec(command, (error, stdout) => {
      if (error) {
        console.error('Error running Docker container:', error)
        reject({ success: false, error: error.message })
      } else {
        console.log('Docker container started:', stdout)
        resolve({ success: true, output: stdout })
      }
    })
  })
})

ipcMain.handle('run-command', async (_, command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error running command:', error)
        reject({ success: false, error: error.message })
      } else {
        resolve({ success: true, output: stdout || stderr })
      }
    })
  })
})

ipcMain.handle('write-json-file', async (_, data) => {
  try {
    const path = `${app.getAppPath()}\\public\\rendering-assets\\match-teams.json`
    const jsonData = JSON.stringify(data, null, 2)
    await fs.mkdir(join(path, '..'), { recursive: true })
    await fs.writeFile(path, jsonData, 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error writing JSON file:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})
