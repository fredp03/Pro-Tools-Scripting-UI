const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#3A3939',
    vibrancy: 'ultra-dark',
    show: false // Don't show until ready-to-show
  });

  // Load the Initial Screen HTML file
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'Initial Screen.html'));

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development mode
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// IPC handler for opening directory dialog
ipcMain.handle('open-directory-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const fs = require('fs');
    const directoryPath = result.filePaths[0];
    
    try {
      // Read all files in the directory
      const files = fs.readdirSync(directoryPath);
      
      // Filter for audio files
      const audioExtensions = ['.mp3', '.wav', '.aiff', '.flac', '.m4a', '.ogg', '.aac', '.wma'];
      const audioFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return audioExtensions.includes(ext);
      }).map(file => ({
        name: file,
        path: path.join(directoryPath, file),
        extension: path.extname(file).toLowerCase()
      }));
      
      return {
        canceled: false,
        directoryPath: directoryPath,
        audioFiles: audioFiles
      };
    } catch (error) {
      console.error('Error reading directory:', error);
      return { canceled: true, error: error.message };
    }
  }
  
  return result;
});

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

// Create application menu (optional)
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            // Add file open functionality here
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createMenu();
});