const fs=require('fs'),crypto=require('crypto'),path=require('path');
module.exports=async function(context){
 const file=path.join(context.appDir,'resources','license-public.pem');
 if(!fs.existsSync(file))throw new Error('Falta clave pública. Ejecuta npm run preparar:claves y guarda la clave privada del propietario.');
 const key=crypto.createPublicKey(fs.readFileSync(file));
 if(key.asymmetricKeyType!=='ed25519')throw new Error('Clave de licencia no compatible.');
};
