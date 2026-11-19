"use strict";

const Lab = {
  mode: "vulnerable",
  last: null,
  run: null,
  reset: null,
  show(kind, title, text) {
    const out = document.getElementById("out");
    out.className = kind ? `out ${kind}` : "out";
    const label = document.createElement("strong");
    label.textContent = title;
    out.replaceChildren(label, ` ${text}`);
  },
  setMode(mode) {
    this.mode = mode;
    document.body.dataset.state = mode;
    document
      .querySelectorAll("[data-mode]")
      .forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
    this.reset();
  },
  start(run, reset) {
    this.run = run;
    this.reset = reset;
    document.body.dataset.state = this.mode;
    document
      .querySelectorAll("[data-mode]")
      .forEach((b) => (b.onclick = () => this.setMode(b.dataset.mode)));
    document.querySelectorAll("[data-payload]").forEach(
      (b) =>
        (b.onclick = () => {
          this.last = b.dataset.payload;
          run(this.last);
        }),
    );
    document
      .querySelectorAll("[data-reset]")
      .forEach((b) => (b.onclick = () => reset()));
    document.querySelectorAll("[data-rerun]").forEach(
      (b) =>
        (b.onclick = () => {
          if (!this.last) {
            this.show(
              "",
              "Select a payload first.",
              "Fire a payload in Section 3 before switching modes.",
            );
            return;
          }
          this.setMode(this.mode === "vulnerable" ? "fixed" : "vulnerable");
          run(this.last);
        }),
    );
    reset();
  },
};

document.querySelectorAll("pre[data-hl]").forEach((pre) => {
  const marked = pre.dataset.hl.split(",").map(Number);
  const lines = pre.textContent.replace(/^\n/, "").trimEnd().split("\n");
  pre.textContent = "";
  lines.forEach((text, i) => {
    const row = document.createElement("span");
    row.textContent = text || " ";
    if (marked.includes(i + 1)) row.className = "hl";
    pre.append(row);
  });
});
