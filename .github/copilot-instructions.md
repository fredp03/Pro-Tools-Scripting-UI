# Pro Tools Scripting UI - AI Assistant Instructions

## Project Overview
This is an Electron desktop application for Pro Tools scripting with a modern dark-themed UI. The app provides a drag-and-drop interface for audio file management and track processing.

## Architecture & Structure

### Core Application (`Master/` directory)
- **Entry Point**: `main.js` - Main Electron process with IPC handlers
- **UI Renderer**: `renderer/` folder contains HTML screens with embedded CSS/JS
- **Build System**: Electron Builder with cross-platform distribution support

### Screen-Based Navigation Pattern
The app uses client-side navigation between HTML files:
- `Initial Screen.html` - File/directory selection interface
- `Show All Files Screen.html` - Audio file listing and processing view
- Data persistence via `localStorage` between screens (see line 131 in Initial Screen.html)

### Responsive Design Structure
Parallel directories (`Initial Screen/`, `Show All Files Screen/`, etc.) contain breakpoint-specific versions:
- `index.html` - Base responsive version
- `breakpoint-1.html`, `breakpoint-2.html`, `breakpoint-3.html` - Device-specific layouts

## Key Development Patterns

### Electron Architecture
- **Security Configuration**: `nodeIntegration: true, contextIsolation: false` (legacy pattern in main.js)
- **IPC Communication**: Uses `ipcRenderer.invoke()` for async main-renderer communication
- **File System Access**: Main process handles directory/file operations via `dialog.showOpenDialog()`

### UI/UX Conventions
- **Color Scheme**: Consistent dark theme (`#3A3939` primary, `#2E2E2E` containers, `#7552A4` accent)
- **Typography**: Inter font family as primary, system fallbacks
- **App Region Handling**: Uses `-webkit-app-region: drag/no-drag` for custom title bar on macOS
- **Padding Adjustment**: `padding-top: 28px` accounts for hidden title bar

### Audio File Processing
- **Supported Formats**: `.mp3, .wav, .aiff, .flac, .m4a, .ogg, .aac, .wma` (see main.js line 46)
- **File Detection**: Directory scanning with extension filtering
- **Data Structure**: Files stored as objects with `{name, path, extension}` properties

## Development Workflow

### Running the Application
```bash
npm start          # Production mode
npm run dev        # Development mode (opens DevTools)
```

### Building for Distribution
```bash
npm run build      # Current platform
npm run build-mac  # macOS DMG
npm run build-win  # Windows NSIS installer  
npm run build-linux # Linux AppImage
```

### File Organization Rules
- **Production Code**: Keep all functional code in `Master/` directory
- **Design Iterations**: Use parallel directories for UI variations/breakpoints
- **Renderer Assets**: All HTML/CSS/JS goes in `Master/renderer/`
- **Build Output**: Generated in `dist/` (excluded from version control)

## Code Style & Conventions

### CSS Architecture
- Embedded `<style>` tags in HTML files (no external stylesheets)
- CSS reset using universal selector
- Flexbox-first layout approach
- Consistent spacing using gap properties

### JavaScript Patterns
- Event delegation via `document.addEventListener('DOMContentLoaded')`
- Async/await for IPC communication
- Error handling with try/catch blocks
- Functional approach for DOM manipulation

### Electron Best Practices
- Window management via global references
- Platform-specific menu handling (see macOS template in main.js line 120)
- Security considerations for new window prevention
- Proper app lifecycle management (`app.whenReady()`, window close handling)

## Integration Points

### File System Operations
All file system access must go through main process IPC handlers. Current handlers:
- `open-directory-dialog` - Returns directory path and filtered audio files

### Platform-Specific Features
- **macOS**: Vibrancy effects, hidden inset title bar, dock icon behavior
- **Cross-platform**: Menu templates with platform conditionals
- **Windows/Linux**: Standard application behavior patterns

When modifying UI components, ensure responsive breakpoint files are updated consistently. When adding new IPC functionality, implement handlers in main.js and corresponding renderer calls.