---
name: open-ds-review
description: Review UI against an Open DS scheme. Use before you finish a screen, or when someone asks whether UI follows the design system.
---

# Review UI against the scheme

Check each point and report what fails, with the rule it breaks:

1. **Components:** only components from `src/components/ui`, and only ones in the inventory (`get_inventory`). No look-alikes.
2. **Tokens:** no raw colours, sizes, spacing, radii or shadows. Only the scheme's variables and component keys.
3. **Usage rules:** each choice matches its situation (`when_to_use`): number in a table, status label, destructive action, field label, focus.
4. **Voice:** labels, errors, empty and success messages follow the voice (open-ds-write).
5. **Meaning:** colour is never the only signal. Danger only for a failure or a loss.
6. **Access:** visible focus, labels on every control, targets the scheme's size, WCAG AA contrast.
7. **Themes:** light first, and dark works too.

For each failure, give the fix and quote the scheme's reason with `why`.
