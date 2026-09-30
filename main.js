const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let win;
function send(status, message, extra={}) {
  if (win && !win.isDestroyed()) win.webContents.send('update-status', {status, message, ...extra});
}
function createWindow(){
  win = new BrowserWindow({
    width: 1450, height: 920, minWidth: 1050, minHeight: 700,
    title: 'Etiquetas Tienda Pro',
    webPreferences: { preload: path.join(__dirname,'preload.js'), contextIsolation:true, nodeIntegration:false }
  });
  win.loadFile('index.html');
  win.webContents.setWindowOpenHandler(() => ({action:'deny'}));
  win.webContents.on('did-finish-load', () => {
    send('checking','Buscando actualizaciones…');
    if (app.isPackaged) autoUpdater.checkForUpdates().catch(err => send('error','No se pudo comprobar la actualización.', {detail:err.message}));
    else send('dev','Modo de desarrollo: la actualización automática se activa en el .EXE instalado.');
  });
}

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.on('checking-for-update', () => send('checking','Buscando actualizaciones…'));
autoUpdater.on('update-available', info => send('available',`Nueva versión ${info.version} encontrada. Descargando…`, {version:info.version}));
autoUpdater.on('update-not-available', info => send('current',`Estás usando la última versión (${info.version || app.getVersion()}).`));
autoUpdater.on('download-progress', p => send('downloading',`Descargando actualización: ${Math.round(p.percent)}%`, {percent:p.percent}));
autoUpdater.on('update-downloaded', async info => {
  send('ready',`Actualización ${info.version} lista para instalar.`, {version:info.version});
  const r = await dialog.showMessageBox(win,{type:'info',buttons:['Instalar y reiniciar','Más tarde'],defaultId:0,cancelId:1,title:'Actualización lista',message:`Etiquetas Tienda Pro ${info.version} está lista.`,detail:'La aplicación se cerrará, instalará la actualización y volverá a abrirse.'});
  if(r.response===0) autoUpdater.quitAndInstall(false,true);
});
autoUpdater.on('error', err => send('error','No se pudo completar la actualización.', {detail:err.message}));

ipcMain.handle('app-version', () => app.getVersion());
ipcMain.handle('check-updates', async () => {
  if(!app.isPackaged) return {ok:false,message:'Disponible al instalar el .EXE.'};
  try { await autoUpdater.checkForUpdates(); return {ok:true}; } catch(e){ return {ok:false,message:e.message}; }
});
ipcMain.on('install-update', () => autoUpdater.quitAndInstall(false,true));

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if(process.platform!=='darwin') app.quit(); });
app.on('activate', () => { if(BrowserWindow.getAllWindows().length===0) createWindow(); });
