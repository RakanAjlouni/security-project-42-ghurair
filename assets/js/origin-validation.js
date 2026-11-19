const ALLOWED_ORIGINS = ["https://app.ghurir.example"];
let balance = 1000,
  outcome = null;
const logEl = document.getElementById("log"),
  balanceEl = document.getElementById("balance");

function onMessageVulnerable(event) {
  balance -= event.data.amount; // no origin check, no validation
  return { accepted: true };
}
function onMessageFixed(event) {
  // SECURITY: exact-match allowlist on event.origin before touching event.data
  if (!ALLOWED_ORIGINS.includes(event.origin))
    return { accepted: false, why: "origin not in allowlist" };
  const m = event.data;
  const valid =
    m &&
    m.type === "transfer" &&
    Number.isFinite(m.amount) &&
    m.amount > 0 &&
    m.amount <= balance;
  if (!valid) return { accepted: false, why: "unexpected message structure" };
  balance -= m.amount;
  return { accepted: true };
}
// The receiving app: one real 'message' listener on window.
window.addEventListener("message", (event) => {
  outcome =
    Lab.mode === "fixed" ? onMessageFixed(event) : onMessageVulnerable(event);
});
const PAYLOADS = {
  trusted: {
    origin: ALLOWED_ORIGINS[0],
    data: { type: "transfer", amount: 50 },
    harmful: false,
  },
  evil: {
    origin: "https://evil.example",
    data: { type: "transfer", amount: 500 },
    harmful: true,
  },
  malformed: {
    origin: ALLOWED_ORIGINS[0],
    data: { type: "transfer", amount: "lots" },
    harmful: true,
  },
};
// Browsers will not let a script forge event.origin, so the senders are simulated:
// we dispatch a real MessageEvent with the origin the sender would have had.
function run(id) {
  const p = PAYLOADS[id];
  window.dispatchEvent(
    new MessageEvent("message", { origin: p.origin, data: p.data }),
  );
  balanceEl.textContent = balance;
  const li = document.createElement("li");
  li.textContent =
    p.origin +
    " sent " +
    JSON.stringify(p.data) +
    " -> " +
    (outcome.accepted ? "ACCEPTED" : "REJECTED (" + outcome.why + ")");
  logEl.prepend(li);
  if (outcome.accepted && p.harmful)
    Lab.show(
      "bad",
      "Vulnerable behavior triggered.",
      "Untrusted or malformed message accepted; balance is now " +
        balance +
        ".",
    );
  else if (outcome.accepted)
    Lab.show(
      "good",
      "Trusted message accepted.",
      "Allowlisted origin and valid structure.",
    );
  else
    Lab.show(
      "good",
      "Message rejected.",
      "Reason: " + outcome.why + ". Balance unchanged.",
    );
}
Lab.start(run, () => {
  balance = 1000;
  balanceEl.textContent = balance;
  logEl.replaceChildren();
  Lab.show("", "Ready.", "Mode: " + Lab.mode + ". Send a message.");
});
