'use strict'

import { app, protocol, BrowserWindow, Menu, clipboard } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import Lokijs from 'lokijs';
import STGlobal from '@/classes/STGlobal';
import fs from 'fs';
import STBrowserWindow from './classes/STBrowserWindow';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global clipboard
(global as STGlobal).clipboard = clipboard;

// load lokijs db
if (!fs.existsSync('./db')) {
  fs.mkdirSync('./db');
}
const lokiDB = new Lokijs('./db/st.db', {
  autoload: true,
  autoloadCallback: (err) => {
    if (!lokiDB.getCollection('snippets')) {
      lokiDB.addCollection('snippets', {
        unique: ['id'],
      });
    }
    if (!lokiDB.getCollection('todos')) {
      lokiDB.addCollection('todos', {
        unique: ['id'],
      });
    }
    lokiDB.saveDatabase();
  },
});
(global as STGlobal).db = lokiDB;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: STBrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new STBrowserWindow({ width: 400, height: 800, webPreferences: {
    nodeIntegration: true
  } })
  win.setMaximizable(false);
  win.setMinimumSize(400, 600);
  Menu.setApplicationMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('move', () => {
    
  })

  win.on('closed', () => {
    win = null
  })
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
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
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