"use strict";

const ALLOWED_ORIGINS = ["https://app.ghurir.example"];
let balance = 1000;
let outcome = null;

const logEl = document.getElementById("log");
const balanceEl = document.getElementById("balance");

function onMessageVulnerable(event) {
  balance -= event.data.amount;
  return { accepted: true };
}

function onMessageFixed(event) {
  if (!ALLOWED_ORIGINS.includes(event.origin)) {
    return {
      accepted: false,
      why: `Origin "${event.origin}" is not on the allowlist`,
    };
  }
  const m = event.data;
  const valid =
    m &&
    m.type === "transfer" &&
    Number.isFinite(m.amount) &&
    m.amount > 0 &&
    m.amount <= balance;
  if (!valid) {
    return {
      accepted: false,
      why: `Amount "${m && m.amount}" is not a valid number`,
    };
  }
  balance -= m.amount;
  return { accepted: true };
}
function renderLog(text, stateClass) {
  logEl.className = stateClass ? `single-log ${stateClass}` : "single-log";
  logEl.textContent = text;
}


window.addEventListener("message", (event) => {
  outcome =
    Lab.mode === "fixed" ? onMessageFixed(event) : onMessageVulnerable(event);
});

const PAYLOADS = {
  trusted: {
    origin: ALLOWED_ORIGINS[0],
    label: "Trusted site",
    data: { type: "transfer", amount: 50 },
    summary: "Transfer $50",
    harmful: false,
  },
  evil: {
    origin: "https://evil.example",
    label: "Untrusted site",
    data: { type: "transfer", amount: 500 },
    summary: "Transfer $500",
    harmful: true,
  },
  malformed: {
    origin: ALLOWED_ORIGINS[0],
    label: "Trusted site",
    data: { type: "transfer", amount: "lots" },
    summary: 'Transfer "lots"',
    harmful: true,
  },
};

function run(id) {
  const p = PAYLOADS[id];
  window.dispatchEvent(
    new MessageEvent("message", { origin: p.origin, data: p.data }),
  );
  balanceEl.textContent = balance;

  if (!outcome.accepted) {
    renderLog(
      `BLOCKED · ${p.label} (${p.origin}) requested "${p.summary}" — ${outcome.why}. Balance stays $${balance}.`,
      "is-blocked",
    );
  } else if (p.harmful) {
    renderLog(
      `UNSAFE ACCEPT · ${p.label} (${p.origin}) requested "${p.summary}". Balance is now $${balance}.`,
      "is-accepted",
    );
  } else {
    renderLog(
      `TRUSTED OK · ${p.label} (${p.origin}) requested "${p.summary}". Balance is now $${balance}.`,
      "is-trusted-ok",
    );
  }

  if (outcome.accepted && p.harmful) {
    Lab.show(
      "bad",
      "Attack succeeded! An untrusted or invalid message changed the balance",
      `Because origin/data checks were missing, "${p.summary}" from ${p.origin} ran and set the balance to $${balance}.`,
    );
  } else if (outcome.accepted) {
    Lab.show(
      "good",
      "Trusted message accepted",
      `The sender (${p.origin}) is allowed and the amount is valid. Current balance: $${balance}.`,
    );
  } else {
    Lab.show(
      "good",
      "Message blocked safely",
      `${outcome.why}. Your balance stays safe at $${balance}.`,
    );
  }
}

Lab.start(run, () => {
  balance = 1000;
  balanceEl.textContent = balance;
  logEl.replaceChildren();
  Lab.show(
    "",
    "Ready to test",
    Lab.mode === "fixed"
      ? "Allowlist check is active: try clicking the untrusted site or bad amount button to see how it gets blocked."
      : "No origin check is active: try clicking the untrusted site button to see what happens.",
  );
});