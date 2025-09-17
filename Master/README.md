# Pro Tools Scripting UI

An Electron application for Pro Tools scripting with a modern user interface.

## Features

- Drag and drop file upload interface
- Modern UI with dark theme
- Cross-platform desktop application
- Built with Electron for native desktop experience

## Development

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Setup

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

To start the application in development mode:
```bash
npm start
```

To start with developer tools open:
```bash
npm run dev
```

### Building for Distribution

To build the app for your current platform:
```bash
npm run build
```

To build for specific platforms:
```bash
npm run build-mac    # Build for macOS
npm run build-win    # Build for Windows
npm run build-linux  # Build for Linux
```

To create a directory build (no installer):
```bash
npm run pack
```

## Project Structure

```
├── main.js                 # Main Electron process
├── package.json           # Project configuration and dependencies
├── renderer/              # Renderer process files (UI)
│   ├── Initial Screen.html
│   └── Show All Files Screen.html
└── dist/                  # Built application (after running build)
```

## Scripts

- `npm start` - Start the Electron app
- `npm run dev` - Start with developer tools
- `npm run build` - Build for all platforms
- `npm run build-mac` - Build for macOS only
- `npm run build-win` - Build for Windows only
- `npm run build-linux` - Build for Linux only
- `npm run pack` - Create unpacked build
- `npm run dist` - Create distribution packages

## License

MIT License