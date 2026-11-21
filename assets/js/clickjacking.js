"use strict";

const TARGET_ORIGIN = "https://bank.example";
const ATTACKER_ORIGIN = "https://evil.example";

const HEADERS = {
  vulnerable: {},
  fixed: {
    "content-security-policy": "frame-ancestors 'self'",
    "x-frame-options": "SAMEORIGIN",
  },
};

// Simulated browser decision: may this site put the page inside a frame?
function browserAllowsFraming(headers, ancestorOrigin) {
  const match = (headers["content-security-policy"] || "").match(
    /frame-ancestors([^;]*)/,
  );

  // Modern browsers use CSP frame-ancestors first and ignore X-Frame-Options.
  if (match) {
    const sources = match[1].trim().split(/\s+/);
    return sources.some(
      (s) =>
        s === ancestorOrigin ||
        (s === "'self'" && ancestorOrigin === TARGET_ORIGIN),
    );
  }

  // Old browsers fall back to X-Frame-Options.
  const xfo = (headers["x-frame-options"] || "").trim().toUpperCase();
  if (xfo === "DENY") return false;
  if (xfo === "SAMEORIGIN") return ancestorOrigin === TARGET_ORIGIN;

  return true; // no rule at all: any site may frame the page
}

// The hidden bank page. Its button is placed exactly under the decoy button.
function targetPage(top) {
  return (
    '<!doctype html><html><body style="margin:0;height:100%;background:rgba(188,75,73,.10);font:600 15px system-ui,sans-serif">' +
    '<span style="position:absolute;left:12px;top:12px;padding:3px 10px;border-radius:99px;background:rgba(255,255,255,.9);color:#8E2F2D;font-size:11px;font-weight:700">bank.example / Settings</span>' +
    '<button id="b" style="position:absolute;left:50%;margin-left:-95px;top:' + top + 'px;width:190px;height:44px;border:0;border-radius:10px;background:#BC4B49;color:#fff;font:700 14px system-ui,sans-serif;cursor:pointer">Delete my account</button>' +
    '<script>' +
    'var b=document.getElementById("b");' +
    'b.onclick=function(){parent.postMessage("account-deleted","*")};' +
    'addEventListener("message",function(e){if(e.source===parent&&e.data&&e.data.type==="top")b.style.top=e.data.value+"px"});' +
    '<\/script></body></html>'
  );
}

const SAFE_DECOY_PAGE =
  '<!doctype html><html><head><title>Decoy Page // Safe Click</title></head>' +
  '<body style="margin:0;height:100vh;display:grid;place-items:center;background:#141C1A;color:#E3EEEA;font:600 15px system-ui,sans-serif;text-align:center;padding:24px">' +
  '<div style="max-width:440px;border:1px solid #2D423C;border-radius:16px;padding:28px;background:#1C2724">' +
  '<p style="font-size:11px;letter-spacing:.18em;color:#7FB0A2;margin:0 0 10px;text-transform:uppercase">Blocked Framing · Safe Click</p>' +
  '<h1 style="margin:0 0 10px;font-size:24px;color:#fff">Decoy Page Reached Safely</h1>' +
  '<p style="color:#B7C7C2;line-height:1.65;margin:0">Your click hit the visible gift button on the decoy site—not a hidden bank action—because framing protection blocked the target page.</p>' +
  '</div></body></html>';

const frame = document.getElementById("frame");
const decoy = document.getElementById("decoy");
const stageLabel = document.getElementById("stage-label");
const stageBlock = document.getElementById("stage-block");
const revealButton = document.getElementById("reveal-btn");

let framed = false;
let revealed = false;

function mountTrap() {
  framed = browserAllowsFraming(
    HEADERS[Lab.mode],
    ATTACKER_ORIGIN,
  );

  revealed = false;

  frame.classList.remove("revealed");
  frame.classList.toggle("live", framed);
  frame.srcdoc = framed ? targetPage(decoy.offsetTop) : "";

  stageBlock.classList.toggle("show", !framed);

  stageLabel.textContent = "What the visitor sees";
  revealButton.classList.remove("on");
  revealButton.textContent = "Reveal layers";
}

function revealLayers() {
  if (!framed) {
    Lab.show(
      "good",
      "Framing blocked — nothing hidden to reveal",
      "The browser refused to embed bank.example inside evil.example, so there is no hidden layer sitting above the gift button.",
    );
    return;
  }

  revealed = !revealed;

  frame.classList.toggle("revealed", revealed);
  revealButton.classList.toggle("on", revealed);

  stageLabel.textContent = revealed
    ? "Hidden layer revealed"
    : "What the visitor sees";

  revealButton.textContent = revealed
    ? "Hide layers"
    : "Reveal layers";

  if (revealed) {
    Lab.show(
      "bad",
      "Hidden action aligned over the decoy button",
      "The bank page sits invisibly above the gift page. When the visitor clicks Claim Now!, the hidden Delete my account button receives the click.",
    );
  } else {
    Lab.show(
      "",
      "Layer hidden again",
      "The bank frame is invisible once more, but in vulnerable mode it remains positioned directly over the decoy button.",
    );
  }
}

function run(id) {
  if (id === "reveal") {
    revealLayers();
  }
}

// If the layout changes, move the hidden button so it stays under the decoy.
window.addEventListener("resize", () => {
  if (framed && frame.contentWindow) {
    frame.contentWindow.postMessage({ type: "top", value: decoy.offsetTop }, "*");
  }
});

window.addEventListener("message", (e) => {
  if (
    e.source === frame.contentWindow &&
    e.data === "account-deleted"
  ) {
    Lab.show(
      "bad",
      "Click hijacked! Hidden action triggered",
      "You meant to claim a gift, but your click hit the invisible bank.example layer and triggered account deletion instead.",
    );
  }
});

decoy.onclick = () => {
  if (framed) return;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(SAFE_DECOY_PAGE);
    win.document.close();
  }

  Lab.show(
    "good",
    "Attack prevented — click stayed harmless",
    "Because framing was blocked, your click went only to the visible gift button (opening the safe decoy page) and never touched bank.example.",
  );
};

Lab.start(run, () => {
  mountTrap();

  Lab.show(
    "",
    "Test both states",
    Lab.mode === "fixed"
      ? "Protection is active: click Claim Now! to see the blocked framing in action, or click Reveal layers."
      : "No framing header is set: click Claim Now! to see the hidden layer steal your click, then click Reveal layers.",
  );
});