// electron/preload.cjs
// Безопасный мост: contextIsolation = true, nodeIntegration = false

const { contextBridge } = require('electron');

// Здесь экспортируются только разрешённые API — офлайн-приложение, без сетевых запросов.
contextBridge.exposeInMainWorld('electronAPI', {
  appInfo: {
    name: 'Solo Leveling System',
    version: '1.0.0',
  },
});
