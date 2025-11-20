const { app, BrowserWindow, screen, ipcMain, globalShortcut } = require('electron');
const path = require('path');

let monitor1Window = null;
let monitor2Window = null;

function createWindow(display, htmlFile, isPrimary = false) {
  const win = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    fullscreen: true,
    kiosk: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(htmlFile);
  
  // Prevent window from being closed accidentally
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
    }
  });

  return win;
}

function createWindows() {
  const displays = screen.getAllDisplays();
  
  if (displays.length === 0) {
    console.error('No displays detected');
    return;
  }

  // Find primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const secondaryDisplays = displays.filter(d => d.id !== primaryDisplay.id);

  // Create Monitor 1 on primary display
  monitor1Window = createWindow(primaryDisplay, 'monitor1.html', true);
  
  // Create Monitor 2 on first secondary display (or primary if only one display)
  const targetDisplay = secondaryDisplays.length > 0 ? secondaryDisplays[0] : primaryDisplay;
  monitor2Window = createWindow(targetDisplay, 'monitor2.html', false);

  // Handle slide synchronization
  ipcMain.on('slide-changed', (event, slideIndex) => {
    if (monitor2Window && !monitor2Window.isDestroyed()) {
      monitor2Window.webContents.send('sync-slide', slideIndex);
    }
  });

  // Handle play/pause synchronization
  ipcMain.on('playback-state-changed', (event, isPlaying) => {
    if (monitor2Window && !monitor2Window.isDestroyed()) {
      monitor2Window.webContents.send('sync-playback', isPlaying);
    }
  });

  console.log(`Created windows on ${displays.length} display(s)`);
}

app.whenReady().then(() => {
  createWindows();

  // Register global keyboard shortcut to exit (Ctrl+Q or Cmd+Q)
  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindows();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

