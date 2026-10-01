'use strict';
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const DAY = 86400000;
const TRIAL_DAYS = 10;
class LicenseManager {
  constructor({statePaths, deviceId, publicKey, now = Date.now}) {
    this.paths = statePaths; this.deviceId = deviceId; this.publicKey = publicKey; this.now = now;
  }
  verify(token) {
    if (typeof token !== 'string' || token.length > 20000) throw new Error('Licencia no válida.');
    const pieces = token.trim().split('.');
    if (pieces.length !== 2) throw new Error('Formato de licencia no válido.');
    const [payload, signature] = pieces;
    if (!/^[A-Za-z0-9_-]+$/.test(payload) || !/^[A-Za-z0-9_-]+$/.test(signature)) throw new Error('Formato de licencia no válido.');
    if (!crypto.verify(null, Buffer.from(payload), this.publicKey, Buffer.from(signature, 'base64url'))) throw new Error('Firma de licencia incorrecta.');
    const data = JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));
    if (data.product !== 'etiquetas-tienda-pro' || data.deviceId !== this.deviceId || data.type !== 'permanent' || typeof data.licenseId !== 'string') throw new Error('La licencia no corresponde a este equipo.');
    return data;
  }
  load() {
    let states = [], damaged = false;
    for (const p of this.paths) {
      if (!fs.existsSync(p)) continue;
      try {
        const s = JSON.parse(fs.readFileSync(p,'utf8'));
        if (s.deviceId !== this.deviceId || !Number.isFinite(s.startedAt) || !Number.isFinite(s.lastSeen) || s.startedAt < 0 || s.lastSeen < s.startedAt) throw new Error('Estado inválido');
        states.push(s);
      } catch(e) { damaged = true; }
    }
    const now = this.now();
    if (!states.length) return {deviceId:this.deviceId,startedAt:now,lastSeen:now,blocked:damaged};
    const state = {deviceId:this.deviceId,startedAt:Math.min(...states.map(s=>s.startedAt)),lastSeen:Math.max(...states.map(s=>s.lastSeen)),blocked:damaged || states.some(s=>s.blocked)};
    state.license = states.map(s=>s.license).find(token=>{try {this.verify(token); return true;} catch(e) {return false;}}) || '';
    return state;
  }
  persist(state) {
    // Both copies are required; a disk error must not silently reset the trial.
    for (const p of this.paths) {
      fs.mkdirSync(path.dirname(p),{recursive:true});
      const tmp = p + '.' + process.pid + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(state), {mode:0o600}); fs.renameSync(tmp,p);
    }
  }
  status() {
    const state = this.load(), now = this.now();
    let licensed = false;
    if (state.license) { try {this.verify(state.license); licensed=true;} catch(e) {} }
    if (!licensed && now + 300000 < state.lastSeen) state.blocked = true;
    state.lastSeen = Math.max(now,state.lastSeen); this.persist(state);
    const expiresAt = state.startedAt + TRIAL_DAYS * DAY;
    const remaining = Math.max(0,expiresAt - Math.max(now,state.lastSeen));
    const allowed = licensed || (!state.blocked && remaining > 0);
    return {allowed,licensed,deviceId:this.deviceId,daysRemaining:licensed?0:Math.ceil(remaining/DAY),expiresAt,reason:licensed?'licensed':state.blocked?'clock-or-storage':allowed?'trial':'expired'};
  }
  activate(token) {
    this.verify(token);
    const state = this.load(); state.license = token.trim(); state.blocked = false;
    this.persist(state); return this.status();
  }
}
module.exports = {LicenseManager,DAY,TRIAL_DAYS};
