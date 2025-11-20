const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Monitor 1: Send slide change to main process
  sendSlideChange: (slideIndex) => {
    ipcRenderer.send('slide-changed', slideIndex);
  },
  
  // Monitor 1: Send playback state change
  sendPlaybackState: (isPlaying) => {
    ipcRenderer.send('playback-state-changed', isPlaying);
  },
  
  // Monitor 2: Listen for slide synchronization
  onSlideSync: (callback) => {
    ipcRenderer.on('sync-slide', (event, slideIndex) => {
      callback(slideIndex);
    });
  },
  
  // Monitor 2: Listen for playback synchronization
  onPlaybackSync: (callback) => {
    ipcRenderer.on('sync-playback', (event, isPlaying) => {
      callback(isPlaying);
    });
  },
  
  // Remove listeners (cleanup)
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

