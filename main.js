const {app,BrowserWindow,ipcMain,dialog,shell,clipboard}=require('electron');
const path=require('path'),fs=require('fs'),os=require('os'),crypto=require('crypto');
const {execFileSync}=require('child_process');
const {pathToFileURL}=require('url');
const {autoUpdater}=require('electron-updater');
const {LicenseManager}=require('./license-manager');
const PAYMENT_URL='https://www.paypal.com/ncp/payment/ADWXLBCSBUVMW';
let win,manager,timer;
const APP_URL=pathToFileURL(path.join(__dirname,'index.html')).href;
function send(channel,data){if(win&&!win.isDestroyed())win.webContents.send(channel,data);}
function deviceId(){
 let id='';
 if(process.platform==='win32'){
  try{const out=execFileSync('reg.exe',['query','HKLM\\SOFTWARE\\Microsoft\\Cryptography','/v','MachineGuid'],{encoding:'utf8',windowsHide:true,timeout:5000});id=out.match(/MachineGuid\s+REG_SZ\s+(\S+)/)?.[1]||'';}catch(e){}
 }
 if(!id)id=os.hostname()+'|'+os.userInfo().username;
 return crypto.createHash('sha256').update('ELSTOP-ETP|'+id).digest('hex').slice(0,32);
}
function licenseStatus(){
 try{return manager.status();}catch(e){return {allowed:false,licensed:false,deviceId:manager?.deviceId||'',daysRemaining:0,reason:'storage-error'};}
}
function validSender(event){return win&&!win.isDestroyed()&&event.sender===win.webContents&&event.senderFrame?.url===APP_URL;}
function handle(channel,fn){ipcMain.handle(channel,async(event,...args)=>{if(!validSender(event))throw new Error('Solicitud no permitida.');return fn(...args);});}
function checkUpdates(){if(!app.isPackaged)return Promise.resolve({ok:false,message:'Disponible en la aplicación instalada.'});return autoUpdater.checkForUpdates().then(()=>({ok:true})).catch(()=>({ok:false,message:'No se pudo comprobar la actualización. Intenta más tarde.'}));}
function createWindow(){
 win=new BrowserWindow({width:1450,height:920,minWidth:1050,minHeight:700,title:'Etiquetas Tienda Pro — EL STOP',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',(event,url)=>{if(url!==APP_URL)event.preventDefault();});
 win.webContents.session.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
 win.webContents.on('did-finish-load',()=>{send('license-status',licenseStatus());checkUpdates();});
 win.loadFile('index.html');
}
autoUpdater.autoDownload=true;
autoUpdater.autoInstallOnAppQuit=true;
// Provider is embedded by electron-builder: no editable URL or URL field in the UI.
autoUpdater.on('checking-for-update',()=>send('update-status',{status:'checking',message:'Buscando actualizaciones…'}));
autoUpdater.on('update-available',info=>send('update-status',{status:'available',message:`Nueva versión ${info.version}. Descargando…`}));
autoUpdater.on('update-not-available',()=>send('update-status',{status:'current',message:'El programa está actualizado.'}));
autoUpdater.on('download-progress',p=>send('update-status',{status:'downloading',message:`Descargando: ${Math.round(p.percent)}%`}));
autoUpdater.on('error',()=>send('update-status',{status:'error',message:'No se pudo comprobar la actualización. Intenta más tarde.'}));
autoUpdater.on('update-downloaded',async info=>{
 send('update-status',{status:'ready',message:`Versión ${info.version} lista.`});
 const answer=await dialog.showMessageBox(win,{type:'info',buttons:['Instalar y reiniciar','Más tarde'],defaultId:0,cancelId:1,title:'Actualización disponible',message:`Etiquetas Tienda Pro ${info.version}`,detail:'La actualización se instalará al reiniciar o cerrar el programa.'});
 if(answer.response===0)autoUpdater.quitAndInstall(false,true);
});
handle('app-version',()=>app.getVersion());
handle('check-updates',checkUpdates);
handle('license-status',()=>licenseStatus());
handle('license-activate',token=>{try{const status=manager.activate(token);send('license-status',status);return {ok:true,status};}catch(e){return {ok:false,message:'Licencia no válida o correspondiente a otro equipo.'};}});
handle('license-pay',async()=>{await shell.openExternal(PAYMENT_URL);return {ok:true};});
handle('license-copy-device',()=>{clipboard.writeText(manager.deviceId);return {ok:true};});
ipcMain.on('install-update',event=>{if(validSender(event)&&autoUpdater.downloadedUpdateHelper?.file)autoUpdater.quitAndInstall(false,true);});
app.whenReady().then(()=>{
 const id=deviceId();
 const keyPath=app.isPackaged?path.join(process.resourcesPath,'license-public.pem'):path.join(__dirname,'resources','license-public.pem');
 if(!fs.existsSync(keyPath)){dialog.showErrorBox('Preparación incompleta','Falta la clave pública de licencias. El propietario debe compilar con el procedimiento de la versión 4.2.');app.quit();return;}
 manager=new LicenseManager({deviceId:id,publicKey:fs.readFileSync(keyPath),statePaths:[path.join(app.getPath('appData'),'ELSTOP-Licencias',id+'.json'),path.join(app.getPath('userData'),'license-state.json')]});
 createWindow();timer=setInterval(()=>send('license-status',licenseStatus()),30000);timer.unref();
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('before-quit',()=>clearInterval(timer));
app.on('activate',()=>{if(manager&&BrowserWindow.getAllWindows().length===0)createWindow();});
