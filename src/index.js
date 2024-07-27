const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const cp = require('child_process')
const exec = cp.exec
const url = require('url')
const path = require('path')

let mainWindow = null

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 700,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'view/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const menu = [
        {
            label: "DevTools",
            submenu: [
                {
                    label: "Show/Hide Dev Tools",
                    accelerator: "Ctrl+D",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools()
                    }
                }
            ]
        }
    ]
    // const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
    createWindow()
})

ipcMain.on('nvmList', (event, info) => {
    exec('nvm list', (error, stdout, stderr) => {
        if(error){
            console.log('ERROR:', error);
        } else {
            console.log(stdout);
            mainWindow.webContents.send('nodeVersionsInstalled', stdout)
        }
    })
})

ipcMain.on('nvmUse', (event, info) => {
    const { version } = info
    exec(`nvm use ${version}`, (error, stdout, stderr) => {
        if(error){
            console.log('ERROR:', error);
        } else {
            console.log(stdout);
        }
    })
})

ipcMain.on('nvmInstall', (event, info) => {
    const { version } = info
    exec(`nvm install ${version}`, (error, stdout, stderr) => {
        if(error){
            console.log('ERROR:', error);
        } else {
            console.log(stdout);
            mainWindow.webContents.send('nodeInstalled', version)
        }
    })
})