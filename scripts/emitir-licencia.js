'use strict';
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const args=process.argv.slice(2);
function value(flag){const i=args.indexOf(flag);return i<0?'':args[i+1]||'';}
const deviceId=value('--equipo'),paymentReference=value('--transaccion');
if(!args.includes('--pago-verificado') || !/^[a-f0-9]{32}$/.test(deviceId) || !paymentReference.trim()) {
 console.error('Primero comprueba en tu PayPal que el pago está completado, el importe es correcto y el destinatario es tu cuenta.');
 console.error('Uso: node scripts/emitir-licencia.js --equipo ID --transaccion REFERENCIA --pago-verificado');process.exit(1);
}
const key=fs.readFileSync(path.join(__dirname,'..','owner-keys','license-private.pem'));
const data={product:'etiquetas-tienda-pro',type:'permanent',deviceId,licenseId:crypto.randomUUID(),issuedAt:new Date().toISOString()};
const payload=Buffer.from(JSON.stringify(data)).toString('base64url');
const signature=crypto.sign(null,Buffer.from(payload),key).toString('base64url');
const token=payload+'.'+signature;
const dir=path.join(__dirname,'..','owner-records');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,data.licenseId+'.json'),JSON.stringify({...data,paymentReference,token},null,2),{mode:0o600});
console.log('Licencia permanente para un equipo. Entrega este código al cliente:\n'+token);
