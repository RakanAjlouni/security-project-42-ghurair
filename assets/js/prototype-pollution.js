"use strict";

let Obj;
let user;
let guest;
const BLOCKED_KEYS = ["__proto__", "constructor", "prototype"];

function mergeVulnerable(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = target[key] || {};
      mergeVulnerable(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

function mergeSafe(target, source) {
  for (const key of Object.keys(source)) {
    if (BLOCKED_KEYS.includes(key)) {
      throw new Error(`Dangerous key rejected: ${key}`);
    }
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!Object.hasOwn(target, key)) {
        target[key] = Object.create(null);
      }
      mergeSafe(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

const isAdminVulnerable = (u) => u.isAdmin === true;
const isAdminFixed = (u) => Object.hasOwn(u, "isAdmin") && u.isAdmin === true;

function makeUser(name) {
  const u = Lab.mode === "fixed" ? Object.create(null) : new Obj();
  u.name = name;
  u.role = "user";
  return u;
}

function setup() {
  Obj = function Obj() {};
  user = makeUser("sam");
  guest = makeUser("guest");
}

const PAYLOADS = {
  proto: '{"__proto__":{"isAdmin":true}}',
  ctor: '{"constructor":{"prototype":{"isAdmin":true}}}',
  benign: '{"name":"Sam Lee"}',
};

function render() {
  const check = Lab.mode === "fixed" ? isAdminFixed : isAdminVulnerable;
  const proto = Object.getPrototypeOf(user);
  const protoKeys = proto ? Object.keys(proto) : null;
  document.getElementById("inspect").textContent =
    `user own props     : ${JSON.stringify(Object.keys(user))}\n` +
    `shared prototype   : ${proto ? JSON.stringify(protoKeys) : "null (no prototype)"}\n` +
    `user.isAdmin       : ${user.isAdmin}\n` +
    `guest.isAdmin      : ${guest.isAdmin}  (never edited directly)\n` +
    `isAdmin(guest)     : ${check(guest)}\n` +
    `real Object.prototype polluted? ${"isAdmin" in Object.prototype}`;
  return check(guest);
}

function run(id) {
  setup();
  let error = null;
  try {
    (Lab.mode === "fixed" ? mergeSafe : mergeVulnerable)(
      user,
      JSON.parse(PAYLOADS[id]),
    );
  } catch (e) {
    error = e.message;
  }
  const adminGranted = render();
  const payloadNote = `Payload sent: ${PAYLOADS[id]}`;

  if (error) {
    Lab.show(
      "good",
      "Dangerous key blocked safely",
      `${error}. The shared prototype stayed clean and no one got admin access. (${payloadNote})`,
    );
  } else if (adminGranted) {
    Lab.show(
      "bad",
      "Prototype polluted! Guest gained admin access",
      `Editing the shared prototype affected "guest" too, even though "guest" was never touched directly. (${payloadNote})`,
    );
  } else {
    Lab.show(
      "good",
      "Safe update applied cleanly",
      `Only the allowed property changed on "user", and "guest" has no admin access. (${payloadNote})`,
    );
  }
}

Lab.start(run, () => {
  setup();
  render();
  Lab.show(
    "",
    "Ready to test",
    Lab.mode === "fixed"
      ? "Protection is active: try a dangerous payload to see it blocked."
      : "No protection is active: try a __proto__ payload to see how it affects guest.",
  );
});