**Team (42 Irbid):** `raajloun` • `aal_ness` • `sal-fara` • `ahalshou` • `ababtah`

# Al Ghurair — Interactive Web Security Sandbox

An interactive, client-side web security sandbox built for the **Al Ghurair Final Project** at **42 Irbid**.

🌐 **Live Demo:** https://rakanajlouni.github.io/security-project-42-ghurair/

---

## Overview

This web application teaches three web vulnerabilities through safe, client-side simulations. Visitors can inspect the vulnerable code, trigger payloads to observe the flaw in real time, and toggle to the patched implementation to verify that the exact same payloads are blocked.

### Covered Vulnerabilities

| Lab | Vulnerability | CWE | OWASP Top 10 | Fix Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Clickjacking** | CWE-1021 | A04:2021 / A05:2021 | Frame protection via `Content-Security-Policy: frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` |
| **02** | **Origin Validation Error** | CWE-346 | A01:2021 | Exact `event.origin` allowlist verification and payload structure validation |
| **03** | **Prototype Pollution** | CWE-1321 | A08:2021 | Reject `__proto__`, `constructor`, and `prototype` keys, use `Object.create(null)`, and check `Object.hasOwn()` |

---

## Project Structure

```text
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
│       ├── clickjacking.js
│       ├── origin-validation.js
│       └── prototype-pollution.js
└── README.md
