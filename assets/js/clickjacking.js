"use strict";

const TARGET_ORIGIN = "https://bank.example";
const ATTACKER_ORIGIN = "https://evil.example";

const HEADERS = {
  vulnerable: {},
  fixed: { "content-security-policy": "frame-ancestors 'self'" },
};

function browserAllowsFraming(headers, ancestorOrigin) {
  const match = (headers["content-security-policy"] || "").match(
    /frame-ancestors([^;]*)/,
  );
  if (!match) return true;
  const sources = match[1].trim().split(/\s+/);
  return sources.some(
    (s) =>
      s === ancestorOrigin ||
      (s === "'self'" && ancestorOrigin === TARGET_ORIGIN),
  );
}

const TARGET_PAGE =
  '<body style="margin:0;background:#fff;font:14px sans-serif"><b style="padding:6px;display:block">bank.example / Settings</b>' +
  '<button id="b" style="position:absolute;left:10px;top:32px;width:150px;height:38px;background:#dc2626;color:#fff;border:0">Delete my account</button>' +
  '<script>document.getElementById("b").onclick=()=>parent.postMessage("account-deleted","*")<\/script></body>';

const frame = document.getElementById("frame");
const decoy = document.getElementById("decoy");
let framed = false;
let launched = false;

function launchAttack() {
  framed = browserAllowsFraming(HEADERS[Lab.mode], ATTACKER_ORIGIN);
  launched = true;
  frame.classList.toggle("live", framed);
  frame.style.opacity = 0;
  if (framed) {
    frame.srcdoc = TARGET_PAGE;
    Lab.show(
      "bad",
      "Framing allowed.",
      'The hidden frame now covers the green button. Click it, or press "Simulate victim click".',
    );
  } else {
    frame.srcdoc = "";
    Lab.show(
      "good",
      "Framing refused.",
      `The browser would not render the page inside ${ATTACKER_ORIGIN} because frame-ancestors 'self' excludes it.`,
    );
  }
}

function run(id) {
  if (id === "launch") launchAttack();
  if (id === "reveal") {
    if (!framed) {
      Lab.show(
        "good",
        "Nothing to reveal.",
        "The target was never loaded, so there is no hidden frame.",
      );
      return;
    }
    frame.style.opacity = 0.6;
  }
  if (id === "click") {
    launchAttack();
    if (framed) {
      frame.addEventListener(
        "load",
        () => frame.contentDocument.getElementById("b").click(),
        { once: true },
      );
    } else {
      decoy.click();
    }
  }
}

window.addEventListener("message", (e) => {
  if (e.source === frame.contentWindow && e.data === "account-deleted") {
    Lab.show(
      "bad",
      "Vulnerable behavior triggered.",
      'A click meant for "Claim free prize" deleted the account (simulated).',
    );
  }
});

decoy.onclick = () => {
  if (!launched) {
    Lab.show("", "Nothing happened.", 'Press "1. Load attack page" first.');
  } else if (!framed) {
    Lab.show(
      "good",
      "Attack blocked.",
      "Only the decoy button was clicked. The real target is not loaded, so nothing was deleted.",
    );
  }
};

Lab.start(run, () => {
  framed = false;
  launched = false;
  frame.classList.remove("live");
  frame.srcdoc = "";
  frame.style.opacity = 0;
  Lab.show("", "Ready.", `Mode: ${Lab.mode}. Press a payload.`);
});
