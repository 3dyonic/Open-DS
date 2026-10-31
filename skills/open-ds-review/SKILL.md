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
5. **Meaning:** colour is never the only signal. Check every colour against its guidance (`get_context <token>` or `open-ds context <scheme> <token>`): it is used for what its intent says, and never for a case in its `not_for`. Use what `not_for` names instead.
6. **Urgency:** a status matches the real risk: info, then warning, then danger. Never a higher level to get attention. Success sits outside the order.
7. **Pairs:** text and icons sit only on the fills their guidance lists (`sits_on`). Tag text is `color.text.primary` on a category fill. Disabled controls use the disabled set, not opacity.
8. **Access:** visible focus, labels on every control, targets the scheme's size, WCAG AA contrast.
9. **Themes:** light first, and dark works too.

Start with `get_context review` (or `open-ds context <scheme> review`): it returns every rule, every colour's guidance and the urgency order in one call.

For each failure, give the fix and quote the scheme's reason with `why`.
