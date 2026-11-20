# IWSS — Interactive Web Security Sandbox

An interactive, client-side web security sandbox built for the **IWSS** at **42 Irbid**.

🌐 **Live Demo:** https://rakanajlouni.github.io/security-project-42-ghurair/

---

## Overview

IWSS provides three safe, interactive web security labs where visitors see how a vulnerability happens, inspect the broken code, and toggle to the fixed version to verify that the same payload is blocked. Everything runs client-side with HTML, CSS, and JavaScript—no backend, login, or database is used.

### Covered Vulnerabilities

| Lab | Vulnerability | CWE | OWASP Top 10 | Fix Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Clickjacking** | CWE-1021 | A04:2021 | Frame protection via `Content-Security-Policy: frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` |
| **02** | **Origin Validation Error** | CWE-346 | A01:2021 | Exact `event.origin` allowlist check and payload validation |
| **03** | **Prototype Pollution** | CWE-1321 | A08:2021 | Block `__proto__`, `constructor`, and `prototype` keys, use `Object.create(null)`, and check with `Object.hasOwn()` |

---

## Key Features & UI

- **Step-by-step lab flow**: Each lab walks through the attack simulation, vulnerable code, remediation code, and references.
- **Vulnerable / Fixed toggle**: Trigger payloads to observe the vulnerability, then switch to the fixed mode and re-test.
- **Unified visual design**: Clean Sage × Soft Apricot theme with responsive layout, code copy buttons, scroll progress bar, and `prefers-reduced-motion` support.
- **Safe educational simulations**: Pure client-side demos with no real targets or sensitive data.

---

## Run Locally

Open `index.html` directly in a browser, or start a local server from the project folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

---

## Project Structure
Plaintext
```
security-project-42-ghurair/
├── index.html
├── labs/
│   ├── clickjacking.html
│   ├── origin-validation.html
│   └── prototype-pollution.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── ui.js
│       ├── clickjacking.js
│       ├── origin-validation.js
│       └── prototype-pollution.js
└── README.md
```
--- 

Team (42 Irbid)

raajloun • aal_ness • sal-fara • ahalshou • ababtah