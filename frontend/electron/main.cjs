const { app, BrowserWindow, shell, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'OmniResearch | Market & Competitor Intelligence',
    backgroundColor: '#f0f7ff',
    show: false, // Prevent white flash before content is ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false, // Allows file:// to load local assets without CORS restrictions
      allowRunningInsecureContent: true,
    },
    autoHideMenuBar: true,
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173');
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('[Electron] Failed to loadFile:', err);
    });
  }

  // Smooth appearance once initial DOM is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Log any load failure for instant diagnosis
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`[Electron] Failed to load ${validatedURL}: ${errorCode} (${errorDescription})`);
  });

  // Open external links in default system browser (StateCraft, Docs, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Application keyboard shortcuts: F12 for DevTools, F5 / Ctrl+R for reload
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      if (input.key === 'F12' || ((input.control || input.meta) && input.shift && input.key.toLowerCase() === 'i')) {
        mainWindow.webContents.toggleDevTools();
        event.preventDefault();
      } else if (input.key === 'F5' || ((input.control || input.meta) && input.key.toLowerCase() === 'r')) {
        mainWindow.reload();
        event.preventDefault();
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


