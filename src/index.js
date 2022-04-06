const { app, BrowserWindow, ipcMain, nativeTheme, dialog } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  win.webContents.openDevTools();

  //console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}

app.whenReady().then(() => {
  createWindow()

  //Magic (https://medium.com/developer-rants/opening-system-dialogs-in-electron-from-the-renderer-6daf49782fd8)
  ipcMain.handle('dialog', (event, method, params) => {       
    return dialog[method](params);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})