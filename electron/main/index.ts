import { app, BrowserWindow, shell, ipcMain, Tray, Menu, dialog, nativeImage } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
const iconPath = join(process.env.VITE_PUBLIC, 'tts-free.png')

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 650,
        minWidth: 900,
        minHeight: 650,
        title: 'Main window',
        // frame: false, // 无边框
        // transparent: true, // 窗体透明
        // backgroundColor: '#ffc',
        icon: iconPath,
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
            // webSecurity: false, //禁用 Electron 中的 Web 安全策略，从而解决 "Refused to frame" 的错误。
        },
    })
    // 隐藏窗口菜单栏
    win.setMenuBarVisibility(false);

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        // win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
    // win.webContents.on('will-navigate', (event, url) => { }) #344

    return win;
}

// app.whenReady().then(createWindow)
app.whenReady().then(() => {
    const mainWindow = createWindow();
    //监听关闭事件
    mainWindow.on('close', () => {
        console.log('close.....')
    })
    // const tray = new Tray(iconPath)  // 系统托盘图标
    const icon = nativeImage.createFromPath(iconPath)
    const tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '打开tts-free',
            click: function() {
                win.show()
            }
        },
        {
            label: '设置',
            click: function () {
                console.log('设置.....')
            }
        },
        {
            label: '退出',
            icon:  join(process.env.VITE_PUBLIC, './tray/exit.png'),
            click: () => {
                app.exit(0);
            }
        }
    ])
    // 当鼠标移动到小图标上方时显示的提示
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

    // 点击托盘图标时
    tray.on('click', () =>{
        win.show();
    })

    win.on("close", (event) => {
        if (dialog.showMessageBoxSync(win, {
            type: "info",
            title: "提示",
            message: "确定要退出吗？",
            buttons: ["最小化到托盘", "直接退出"],
            defaultId: 0,
            cancelId: 1
        }) === 0) {
            event.preventDefault();
            win.hide();
        } else {
            app.exit();
        }
    });
})

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
    // 清理以下对象：
    // 1. 主窗口（BrowserWindow）：如果你创建了一个或多个主窗口，当所有主窗口都关闭时，可以调用 app.quit() 来退出应用程序。
    // 2. 托盘图标（Tray）：如果你创建了托盘图标，当所有主窗口关闭并且应用程序即将退出时，可以调用 tray.destroy() 方法来销毁托盘图标对象。
    // 3. 自定义菜单（Menu）：如果你创建了自定义菜单，当所有主窗口关闭并且应用程序即将退出时，可以调用 Menu.setApplicationMenu(null) 来清除应用程序的菜单栏。
    // 4. 其他需要手动清理的自定义对象：如果你在应用程序中使用了其他自定义对象，例如自定义计时器、网络连接等
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// ipcMain.on("min", (e) => win.minimize());
// ipcMain.on("window-maximize", function () {
//     if (win.isFullScreen()) {
//         win.setFullScreen(false);
//     } else if (win.isMaximized()) {
//         win.unmaximize();
//     } else {
//         win.maximize();
//     }
// });
// ipcMain.on("close", (e) => win.close());
// ipcMain.on("reload", (e) => win.reload());




// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, { hash: arg })
    }
})


const ElectronStore = require("electron-store");
ElectronStore.initRenderer();
// https://github.com/sindresorhus/electron-store/issues/212