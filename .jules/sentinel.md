## 2024-03-24 - [Insecure Predictable Identifier Generation Risk]
**Vulnerability:** Found multiple instances where sensitive identifiers (like Order IDs) were generated using predictable methods like `Date.now()` and `Math.random()`.
**Learning:** Using predictable timestamps or weak pseudo-random number generators for unique identifiers can lead to Insecure Direct Object Reference (IDOR) vulnerabilities, allowing an attacker to enumerate and access other users' orders or sensitive data by guessing IDs.
**Prevention:** Always use cryptographically secure methods like `crypto.randomUUID()` to generate unguessable, universally unique identifiers for objects, especially when they refer to sensitive entities like orders, user profiles, or secure links.

## 2024-03-24 - [Unsafe `window.open` Link Target Vulnerability]
**Vulnerability:** Found `window.open(..., '_blank')` used without the `noopener,noreferrer` flags in UI action handlers like WhatsApp sharing and Google Maps navigation.
**Learning:** Opening new tabs or windows using `_blank` without these security flags leaves the new window with a reference to the original `window.opener` object, which malicious destinations could exploit to change the original page's location (tabnabbing) or execute limited cross-site scripts.
**Prevention:** Always append `'noopener,noreferrer'` as the third argument to `window.open` when navigating to external origins or use `rel="noopener noreferrer"` on `target="_blank"` anchor tags.
