'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  session,
  MessageBoxOptions,
  dialog
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater, UpdateInfo } from 'electron-updater'
const isDevelopment = process.env.NODE_ENV !== 'production'

// auto update configuration
autoUpdater.autoDownload = false
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall(true, true)
})
autoUpdater.on('update-available', async (info: UpdateInfo) => {
  const dialogOpt: MessageBoxOptions = {
    type: 'info',
    buttons: ['立即更新', '暂不更新'],
    defaultId: 0,
    cancelId: 1,
    title: '软件更新',
    message: `v${info.version}\n${info.releaseNotes}`,
    detail: '检测到新版本，是否更新'
  }

  const { response: choice } = await dialog.showMessageBox(dialogOpt)
  if (choice === 0) {
    autoUpdater.downloadUpdate()
  }
})

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 400,
    height:
      process.platform === 'darwin'
        ? 796
        : process.platform === 'win32'
        ? 802
        : 800,
    resizable: false,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      webSecurity: false,
      enableRemoteModule: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdates()
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  // Add referer to requests
  const filter = {
    urls: ['https://*/*', 'http://*/*']
  }
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders['Referer'] = 'https://fund.eastmoney.com/'
      callback({ requestHeaders: details.requestHeaders })
    }
  )
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

app.setName('Duck Fund')
app.setAboutPanelOptions({
  applicationName: 'Duck Fund',
  applicationVersion: 'Version 0.1.4',
  version: '',
  copyright: '数据来源: 天天基金网'
})
