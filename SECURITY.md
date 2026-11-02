# Security

## Report a vulnerability

Report it privately through [GitHub private vulnerability reporting](https://github.com/3dyonic/Open-DS/security/advisories/new). Do not open a public issue for a vulnerability, a leaked secret or credential, or a way to break a check on purpose.

When the fix is out, the advisory is published and you are credited, unless you ask not to be.

## Supported versions

Only the latest release of the `open-ds` package gets security fixes. Upgrade with `npm install open-ds@latest`.

## What this repository does

- It holds no secrets, tokens, deploy settings or private notes. The hosted site's settings live in a private repository.
- Every pull request is checked for vulnerable dependencies, leaked secrets and unsafe workflows (`.github/workflows/security.yml`).
- The npm package is published through npm Trusted Publishing, with provenance.
