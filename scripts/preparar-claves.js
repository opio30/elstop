'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const privatePath=path.join(root,'owner-keys','license-private.pem');
const publicPath=path.join(root,'resources','license-public.pem');
if(fs.existsSync(privatePath)) {
 const privateKey=fs.readFileSync(privatePath);
 const derived=crypto.createPublicKey(privateKey).export({type:'spki',format:'pem'});
 if(fs.existsSync(publicPath) && fs.readFileSync(publicPath,'utf8')!==derived) throw new Error('Las claves no coinciden. Restaura el par original.');
 fs.mkdirSync(path.dirname(publicPath),{recursive:true}); fs.writeFileSync(publicPath,derived);
 console.log('Se conserva la clave de licencias original.');
} else {
 if(fs.existsSync(publicPath)) throw new Error('Falta la clave privada original. No regenerar: invalidaría las licencias de tus clientes.');
 const keys=crypto.generateKeyPairSync('ed25519',{privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}});
 fs.mkdirSync(path.dirname(privatePath),{recursive:true});fs.writeFileSync(privatePath,keys.privateKey,{mode:0o600});
 fs.mkdirSync(path.dirname(publicPath),{recursive:true});fs.writeFileSync(publicPath,keys.publicKey);
 console.log('Claves creadas. Guarda una copia segura de owner-keys y resources/license-public.pem antes de distribuir.');
 console.log('La clave privada nunca debe ir a GitHub ni al instalador.');
}
