const {contextBridge,ipcRenderer}=require('electron');
function subscribe(channel,callback){const listener=(_event,data)=>callback(data);ipcRenderer.on(channel,listener);return ()=>ipcRenderer.removeListener(channel,listener);}
contextBridge.exposeInMainWorld('desktopApp',{
 version:()=>ipcRenderer.invoke('app-version'),
 checkUpdates:()=>ipcRenderer.invoke('check-updates'),
 installUpdate:()=>ipcRenderer.send('install-update'),
 onUpdateStatus:callback=>subscribe('update-status',callback),
 licenseStatus:()=>ipcRenderer.invoke('license-status'),
 activateLicense:token=>ipcRenderer.invoke('license-activate',token),
 openPayment:()=>ipcRenderer.invoke('license-pay'),
 copyDeviceId:()=>ipcRenderer.invoke('license-copy-device'),
 onLicenseStatus:callback=>subscribe('license-status',callback)
});
