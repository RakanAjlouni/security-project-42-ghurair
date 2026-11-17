**Team (42 Irbid):** `raajloun` • `aal_ness` • `sal-fara` • `ahalshou` • `ababtah`
# 0x42-ghurir-sandbox

An interactive, client-side web security sandbox built for the **Ghurair Final Project** at **42 Irbid** (November 2026).

---

## Overview

This web application teaches three modern client-side web vulnerabilities through hands-on, browser-safe simulations. Visitors can inspect the vulnerable code, execute payloads to observe the impact in real time, and toggle to the patched implementation to verify that the exact same payloads are blocked.

### Covered Vulnerabilities

| Lab | Vulnerability | CWE | OWASP Top 10 | Fix Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Prototype Pollution** *(Team Challenge)*[cite: 2] | CWE-1321 | A03:2021 / A08:2021 | Reject `__proto__`, `constructor`, and `prototype` keys during object merging |
| **02** | **`postMessage` Origin Bypass** | CWE-346 | A01:2021 | Strict `event.origin` allowlist verification before processing messages |
| **03** | **Clickjacking (UI Redressing)** | CWE-1021 | A01:2021 / A05:2021 | Frame protection via `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'` |

---
