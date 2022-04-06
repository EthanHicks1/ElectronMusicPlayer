const { contextBridge, ipcRenderer, dialog, remote } = require('electron')

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('bruh', {
    capping: () => console.log("Hello my guy"),
})

contextBridge.exposeInMainWorld('electron', {
    // From https://medium.com/developer-rants/opening-system-dialogs-in-electron-from-the-renderer-6daf49782fd8
    openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config)
  });

/*contextBridge.exposeInMainWorld('bruh2', {
    capping2: () => console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })),
    /*capping2: () => await dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters : [
            {
                name : 'Music files',
                extensions: ['mp3', 'wav']
            }
        ]
    })*/
//})