# Dual-Monitor Kiosk Slideshow

A production-ready Electron.js application that displays synchronized slideshows on multiple monitors in fullscreen kiosk mode.

## Features

- **Dual-Monitor Support**: Automatically detects all displays and creates fullscreen windows
- **Synchronized Slideshows**: Monitor 2 syncs with Monitor 1's slide changes
- **Auto-Advancing**: Configurable slide speed (2s, 4s, 6s)
- **Play/Pause Control**: Toggle slideshow playback
- **Navigation**: Previous/Next buttons for manual control
- **Smooth Transitions**: Fade effects between slides
- **Secure IPC**: Uses contextBridge for safe inter-process communication
- **Kiosk Mode**: Fullscreen, no frame, no browser chrome

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the application:
```bash
npm start
```

2. The application will:
   - Detect all available displays
   - Create Monitor 1 window on the primary display with controls
   - Create Monitor 2 window on the secondary display (or primary if only one display)

3. Controls (Monitor 1):
   - **Previous/Next**: Navigate slides manually
   - **Play/Pause**: Toggle auto-advancing
   - **Speed Selector**: Change slide duration (2s, 4s, 6s)
   - **Slide Counter**: Shows current slide position

4. Exit the application:
   - Press `Ctrl+Q` (or `Cmd+Q` on macOS)

## Keyboard Shortcuts

- `Arrow Left`: Previous slide
- `Arrow Right`: Next slide
- `Space`: Play/Pause toggle
- `Ctrl+Q` / `Cmd+Q`: Exit application

## Project Structure

```
dual-monitor-slide/
├── package.json      # Project dependencies and scripts
├── main.js           # Electron main process (window management)
├── preload.js        # IPC bridge using contextBridge
├── monitor1.html     # Primary display with controls
└── monitor2.html     # Secondary display (synchronized)
```

## Technical Details

- **IPC Communication**: Monitor 1 sends slide index and playback state changes to Monitor 2 via Electron IPC
- **Image Sources**: Uses Unsplash placeholder images (nature/landscape for Monitor 1, mountain/outdoor for Monitor 2)
- **Security**: Uses contextBridge for secure IPC communication (no nodeIntegration)
- **Error Handling**: Includes proper window lifecycle management and cleanup

## Customization

To change the images, edit the `images` array in:
- `monitor1.html` (line ~120)
- `monitor2.html` (line ~90)

## Requirements

- Node.js (v14 or higher)
- Electron (v28 or higher)
- Multiple displays (recommended, but works with single display)

