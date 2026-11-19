const TARGET_ORIGIN = "https://bank.example",
  ATTACKER_ORIGIN = "https://evil.example";
// Simulated server responses for the target page.
const HEADERS = {
  vulnerable: {},
  fixed: { "content-security-policy": "frame-ancestors 'self'" },
};
// Simulates the BROWSER's framing decision. Real enforcement is done by the browser
// from HTTP headers; this JS only imitates that decision so it can be shown without a backend.
function browserAllowsFraming(headers, ancestorOrigin) {
  const match = (headers["content-security-policy"] || "").match(
    /frame-ancestors([^;]*)/,
  );
  if (!match) return true; // no policy: any site may frame the page
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
const frame = document.getElementById("frame"),
  decoy = document.getElementById("decoy");
let framed = false,
  launched = false; // launched: attack page has been loaded

function launchAttack() {
  framed = browserAllowsFraming(HEADERS[Lab.mode], ATTACKER_ORIGIN);
  launched = true;
  frame.classList.toggle("live", framed); // a blocked frame must not sit on top of the decoy
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
      "The browser would not render the page inside " +
        ATTACKER_ORIGIN +
        " because frame-ancestors 'self' excludes it.",
    );
  }
}
function run(id) {
  if (id === "launch") launchAttack();
  if (id === "reveal") {
    if (!framed)
      return Lab.show(
        "good",
        "Nothing to reveal.",
        "The target was never loaded, so there is no hidden frame.",
      );
    frame.style.opacity = 0.6;
  }
  if (id === "click") {
    // the victim clicks the decoy
    launchAttack();
    if (framed)
      frame.addEventListener(
        "load",
        () => frame.contentDocument.getElementById("b").click(),
        { once: true },
      );
    else decoy.click(); // frame refused: the click only reaches the harmless decoy
  }
}
// Only trust messages coming from our own frame.
window.addEventListener("message", (e) => {
  if (e.source === frame.contentWindow && e.data === "account-deleted")
    Lab.show(
      "bad",
      "Vulnerable behavior triggered.",
      'A click meant for "Claim prize" deleted the account (simulated).',
    );
});
decoy.onclick = () => {
  if (!launched)
    Lab.show("", "Nothing happened.", 'Press "1. Load attack page" first.');
  else if (!framed)
    Lab.show(
      "good",
      "Attack blocked.",
      "Only the decoy button was clicked. The real target is not loaded, so nothing was deleted.",
    );
};
Lab.start(run, () => {
  framed = false;
  launched = false;
  frame.classList.remove("live");
  frame.srcdoc = "";
  frame.style.opacity = 0;
  Lab.show("", "Ready.", "Mode: " + Lab.mode + ". Press a payload.");
});
