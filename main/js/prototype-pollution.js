// Isolated sandbox: users inherit from Obj.prototype, NOT the real Object.prototype chain's top,
// so a polluted prototype here never touches the page's global Object.prototype.
let Obj, user, guest;
const BLOCKED_KEYS = ['__proto__', 'constructor', 'prototype'];

function mergeVulnerable(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = target[key] || {};
      mergeVulnerable(target[key], source[key]); // follows "__proto__" into the prototype
    } else target[key] = source[key];
  }
}
function mergeSafe(target, source) {
  for (const key of Object.keys(source)) {
    if (BLOCKED_KEYS.includes(key)) throw new Error('Dangerous key rejected: ' + key);
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!Object.hasOwn(target, key)) target[key] = Object.create(null);
      mergeSafe(target[key], source[key]);
    } else target[key] = source[key];
  }
}
const isAdminVulnerable = u => u.isAdmin === true;
const isAdminFixed = u => Object.hasOwn(u, 'isAdmin') && u.isAdmin === true;

function makeUser(name) {
  const u = Lab.mode === 'fixed' ? Object.create(null) : new Obj();
  u.name = name; u.role = 'user';
  return u;
}
function setup() { Obj = function Obj() {}; user = makeUser('sam'); guest = makeUser('guest'); }
const PAYLOADS = {
  proto: '{"__proto__":{"isAdmin":true}}',
  ctor: '{"constructor":{"prototype":{"isAdmin":true}}}',
  benign: '{"name":"Sam Lee"}'
};
function render() {
  const check = Lab.mode === 'fixed' ? isAdminFixed : isAdminVulnerable;
  const proto = Object.getPrototypeOf(user);
  const protoKeys = proto ? Object.keys(proto) : null;
  document.getElementById('inspect').textContent =
    'user own props     : ' + JSON.stringify(Object.keys(user)) + '\n' +
    'shared prototype   : ' + (proto ? JSON.stringify(protoKeys) : 'null (no prototype)') + '\n' +
    'user.isAdmin       : ' + user.isAdmin + '\n' +
    'guest.isAdmin      : ' + guest.isAdmin + '  (never edited)\n' +
    'isAdmin(user)      : ' + check(user) + '\n' +
    'real Object.prototype polluted? ' + ('isAdmin' in Object.prototype);
  return check(guest);
}
function run(id) {
  setup();
  let error = null;
  try { (Lab.mode === 'fixed' ? mergeSafe : mergeVulnerable)(user, JSON.parse(PAYLOADS[id])); }
  catch (e) { error = e.message; }
  const adminGranted = render();
  const text = ' Payload: ' + PAYLOADS[id];
  if (error) Lab.show('good', 'Dangerous property rejected.', error + '. No one gained admin.' + text);
  else if (adminGranted) Lab.show('bad', 'Prototype property modified.', 'An untouched guest now passes the admin check via inheritance.' + text);
  else Lab.show('good', 'Profile updated.', 'Safe input merged; no admin access.' + text);
}
Lab.start(run, () => { setup(); render(); Lab.show('', 'Ready.', 'Mode: ' + Lab.mode + '. Send a payload.'); });
