# Component pairs to review

Base `origin/master` against candidate `origin/feat/od-297-accepted-decisions`. 395 of 4256 pairs are flagged, in 37 components. Colors are hex: foreground on background, before → after.

## accordion

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--accordion-item-divider` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## alert

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--alert-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | rest | text: `--alert-default-label` on `--alert-default-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#222222` | 17.20 → 14.85 | 0.785 → 0.724 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | text: `--alert-destructive-label` on `--alert-destructive-background` | `#F28B8B` on `#141414` | `#F28B8B` on `#222222` | 7.76 → 6.70 | 0.570 → 0.511 | 0.000 / 0.061 | moved (approval), WCAG level drop |
| accessible-first/dark | *:data-[slot=alert-description] | text: `--alert-destructive-description-label` on `--alert-destructive-background` | `#F28B8B` on `#141414` | `#F28B8B` on `#222222` | 7.76 → 6.70 | 0.570 → 0.511 | 0.000 / 0.061 | moved (approval), WCAG level drop |

## alert-dialog

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--alert-dialog-content-label` on `--alert-dialog-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| content-first/dark | rest | text: `--alert-dialog-content-label` on `--alert-dialog-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| accessible-first/dark | rest | text: `--alert-dialog-content-label` on `--alert-dialog-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--alert-dialog-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| brand-expressive/dark | rest | text: `--alert-dialog-content-label` on `--alert-dialog-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--alert-dialog-content-label` on `--alert-dialog-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--alert-dialog-content-label` on `--alert-dialog-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--alert-dialog-content-label` on `--alert-dialog-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |

## attachment

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--attachment-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## avatar

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--avatar-fallback-label` on `--avatar-fallback-background` | `#969FAD` on `#262D38` | `#969FAD` on `#0D1117` | 5.19 → 7.08 | 0.405 → 0.524 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | rest | text: `--avatar-group-count-label` on `--avatar-group-count-background` | `#969FAD` on `#262D38` | `#969FAD` on `#0D1117` | 5.19 → 7.08 | 0.405 → 0.524 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--avatar-fallback-label` on `--avatar-fallback-background` | `#A39A8B` on `#2E2A24` | `#A39A8B` on `#14110D` | 5.13 → 6.77 | 0.403 → 0.510 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | rest | text: `--avatar-group-count-label` on `--avatar-group-count-background` | `#A39A8B` on `#2E2A24` | `#A39A8B` on `#14110D` | 5.13 → 6.77 | 0.403 → 0.510 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--avatar-fallback-label` on `--avatar-fallback-background` | `#B4B4B4` on `#222222` | `#B4B4B4` on `#141414` | 7.67 → 8.89 | 0.518 → 0.579 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | text: `--avatar-group-count-label` on `--avatar-group-count-background` | `#B4B4B4` on `#222222` | `#B4B4B4` on `#141414` | 7.67 → 8.89 | 0.518 → 0.579 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--avatar-fallback-label` on `--avatar-fallback-background` | `#B5988A` on `#33241F` | `#B5988A` on `#120B09` | 5.54 → 7.26 | 0.426 → 0.544 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | rest | text: `--avatar-group-count-label` on `--avatar-group-count-background` | `#B5988A` on `#33241F` | `#B5988A` on `#120B09` | 5.54 → 7.26 | 0.426 → 0.544 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--avatar-fallback-label` on `--avatar-fallback-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--avatar-fallback-label` on `--avatar-fallback-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--avatar-fallback-label` on `--avatar-fallback-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--avatar-group-count-label` on `--avatar-group-count-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--avatar-group-count-label` on `--avatar-group-count-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--avatar-group-count-label` on `--avatar-group-count-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |

## badge

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--badge-neutral-label` on `--badge-neutral-background` | `#C4CBD6` on `#262D38` | `#C4CBD6` on `#0D1117` | 8.49 → 11.59 | 0.545 → 0.664 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--badge-neutral-label` on `--badge-neutral-background` | `#CFC6B6` on `#2E2A24` | `#CFC6B6` on `#14110D` | 8.42 → 11.12 | 0.542 → 0.650 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--badge-neutral-label` on `--badge-neutral-background` | `#D6D6D6` on `#222222` | `#D6D6D6` on `#141414` | 10.95 → 12.68 | 0.624 → 0.685 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--badge-neutral-label` on `--badge-neutral-background` | `#E2C4B3` on `#33241F` | `#E2C4B3` on `#120B09` | 9.05 → 11.86 | 0.565 → 0.684 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--badge-neutral-label` on `--badge-neutral-background` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--badge-neutral-label` on `--badge-neutral-background` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--badge-neutral-label` on `--badge-neutral-background` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |

## bubble

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--bubble-body-them-label` on `--bubble-body-them-background` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--bubble-body-them-label` on `--bubble-body-them-background` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--bubble-body-them-label` on `--bubble-body-them-background` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--bubble-body-them-label` on `--bubble-body-them-background` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--bubble-body-them-label` on `--bubble-body-them-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--bubble-body-them-label` on `--bubble-body-them-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--bubble-body-them-label` on `--bubble-body-them-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## button

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | hover | text: `--button-ghost-label` on `--button-ghost-background-hover` | `#BEBBFB` on `#262D38` | `#BEBBFB` on `#0D1117` | 7.72 → 10.54 | 0.526 → 0.645 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | hover | text: `--button-ghost-label` on `--button-ghost-background-hover` | `#ACBDD5` on `#2E2A24` | `#ACBDD5` on `#14110D` | 7.46 → 9.85 | 0.508 → 0.615 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | hover | text: `--button-ghost-label` on `--button-ghost-background-hover` | `#A7C8FC` on `#222222` | `#A7C8FC` on `#141414` | 9.33 → 10.80 | 0.581 → 0.641 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | hover | text: `--button-ghost-label` on `--button-ghost-background-hover` | `#FBB4D8` on `#33241F` | `#FBB4D8` on `#120B09` | 8.93 → 11.71 | 0.576 → 0.693 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--button-ghost-label` on `--button-ghost-background-hover` | `#A1DCD4` on `#1E293B` | `#A1DCD4` on `#020617` | 9.55 → 13.16 | 0.576 → 0.726 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--button-ghost-label` on `--button-ghost-background-hover` | `#C9B7FC` on `#1E293B` | `#C9B7FC` on `#020617` | 8.12 → 11.20 | 0.544 → 0.693 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--button-ghost-label` on `--button-ghost-background-hover` | `#FCBD9F` on `#1E293B` | `#FCBD9F` on `#020617` | 9.00 → 12.41 | 0.581 → 0.729 | 0.000 / 0.151 | moved (approval) |

## button-group

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--button-group-text-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## card

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | text: `--card-label` on `--card-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#222222` | 17.20 → 14.85 | 0.785 → 0.724 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | border: `--card-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| brand-expressive/dark | rest | text: `--card-label` on `--card-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--card-label` on `--card-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--card-label` on `--card-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--card-label` on `--card-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |

## chart

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | [&_.recharts-radial-bar-background-sector] | icon: `--chart-track-fill` on the page | `#262D38` on `#0D1117` | `#0D1117` on `#0D1117` | 1.37 → 1.00 | 0.119 → 0.000 | 0.119 / 0.000 | moved (approval), difference below the floor |
| dense-data/dark | [&_.recharts-rectangle.recharts-tooltip-cursor] | icon: `--chart-cursor-fill` on the page | `#262D38` on `#0D1117` | `#0D1117` on `#0D1117` | 1.37 → 1.00 | 0.119 → 0.000 | 0.119 / 0.000 | moved (approval), difference below the floor |
| content-first/dark | [&_.recharts-radial-bar-background-sector] | icon: `--chart-track-fill` on the page | `#2E2A24` on `#14110D` | `#14110D` on `#14110D` | 1.32 → 1.00 | 0.107 → 0.000 | 0.107 / 0.000 | moved (approval), difference below the floor |
| content-first/dark | [&_.recharts-rectangle.recharts-tooltip-cursor] | icon: `--chart-cursor-fill` on the page | `#2E2A24` on `#14110D` | `#14110D` on `#14110D` | 1.32 → 1.00 | 0.107 → 0.000 | 0.107 / 0.000 | moved (approval), difference below the floor |
| accessible-first/dark | [&_.recharts-cartesian-grid_line] | icon: `--chart-grid-line` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | [&_.recharts-curve.recharts-tooltip-cursor] | icon: `--chart-cursor-line` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | [&_.recharts-polar-grid] | icon: `--chart-grid-line` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | [&_.recharts-radial-bar-background-sector] | icon: `--chart-track-fill` on the page | `#222222` on `#0A0A0A` | `#141414` on `#0A0A0A` | 1.24 → 1.07 | 0.107 → 0.046 | 0.061 / 0.000 | moved (approval), difference below the floor |
| accessible-first/dark | [&_.recharts-rectangle.recharts-tooltip-cursor] | icon: `--chart-cursor-fill` on the page | `#222222` on `#0A0A0A` | `#141414` on `#0A0A0A` | 1.24 → 1.07 | 0.107 → 0.046 | 0.061 / 0.000 | moved (approval), difference below the floor |
| accessible-first/dark | [&_.recharts-reference-line] | icon: `--chart-grid-line` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | rest | border: `--chart-tooltip-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| brand-expressive/dark | [&_.recharts-radial-bar-background-sector] | icon: `--chart-track-fill` on the page | `#33241F` on `#120B09` | `#120B09` on `#120B09` | 1.31 → 1.00 | 0.119 → 0.000 | 0.119 / 0.000 | moved (approval), difference below the floor |
| brand-expressive/dark | [&_.recharts-rectangle.recharts-tooltip-cursor] | icon: `--chart-cursor-fill` on the page | `#33241F` on `#120B09` | `#120B09` on `#120B09` | 1.31 → 1.00 | 0.119 → 0.000 | 0.119 / 0.000 | moved (approval), difference below the floor |
| multi-brand/aster-dark | [&_.recharts-radial-bar-background-sector] | icon: `--chart-track-fill` on the page | `#1E293B` on `#020617` | `#020617` on `#020617` | 1.38 → 1.00 | 0.151 → 0.000 | 0.151 / 0.000 | moved (approval), difference below the floor |
| multi-brand/birch-dark | [&_.recharts-radial-bar-background-sector] | icon: `--chart-track-fill` on the page | `#1E293B` on `#020617` | `#020617` on `#020617` | 1.38 → 1.00 | 0.151 → 0.000 | 0.151 / 0.000 | moved (approval), difference below the floor |
| multi-brand/coral-dark | [&_.recharts-radial-bar-background-sector] | icon: `--chart-track-fill` on the page | `#1E293B` on `#020617` | `#020617` on `#020617` | 1.38 → 1.00 | 0.151 → 0.000 | 0.151 / 0.000 | moved (approval), difference below the floor |
| multi-brand/aster-dark | [&_.recharts-rectangle.recharts-tooltip-cursor] | icon: `--chart-cursor-fill` on the page | `#1E293B` on `#020617` | `#020617` on `#020617` | 1.38 → 1.00 | 0.151 → 0.000 | 0.151 / 0.000 | moved (approval), difference below the floor |
| multi-brand/birch-dark | [&_.recharts-rectangle.recharts-tooltip-cursor] | icon: `--chart-cursor-fill` on the page | `#1E293B` on `#020617` | `#020617` on `#020617` | 1.38 → 1.00 | 0.151 → 0.000 | 0.151 / 0.000 | moved (approval), difference below the floor |
| multi-brand/coral-dark | [&_.recharts-rectangle.recharts-tooltip-cursor] | icon: `--chart-cursor-fill` on the page | `#1E293B` on `#020617` | `#020617` on `#020617` | 1.38 → 1.00 | 0.151 → 0.000 | 0.151 / 0.000 | moved (approval), difference below the floor |

## combobox

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--combobox-content-label` on `--combobox-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | *:data-[slot=input-group] | text: `--combobox-content-label` on `--combobox-input-background` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | data-highlighted | text: `--combobox-item-label-highlight` on `--combobox-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | rest | text: `--combobox-chip-label` on `--combobox-chip-background` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--combobox-content-label` on `--combobox-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | *:data-[slot=input-group] | text: `--combobox-content-label` on `--combobox-input-background` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | data-highlighted | text: `--combobox-item-label-highlight` on `--combobox-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | rest | text: `--combobox-chip-label` on `--combobox-chip-background` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--combobox-content-label` on `--combobox-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--combobox-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | *:data-[slot=input-group] | text: `--combobox-content-label` on `--combobox-input-background` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | *:data-[slot=input-group] | border: `--combobox-input-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | data-highlighted | text: `--combobox-item-label-highlight` on `--combobox-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | text: `--combobox-chip-label` on `--combobox-chip-background` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--combobox-content-label` on `--combobox-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | *:data-[slot=input-group] | text: `--combobox-content-label` on `--combobox-input-background` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | data-highlighted | text: `--combobox-item-label-highlight` on `--combobox-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | rest | text: `--combobox-chip-label` on `--combobox-chip-background` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--combobox-content-label` on `--combobox-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--combobox-content-label` on `--combobox-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--combobox-content-label` on `--combobox-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | *:data-[slot=input-group] | text: `--combobox-content-label` on `--combobox-input-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | *:data-[slot=input-group] | text: `--combobox-content-label` on `--combobox-input-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | *:data-[slot=input-group] | text: `--combobox-content-label` on `--combobox-input-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | data-highlighted | text: `--combobox-item-label-highlight` on `--combobox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | data-highlighted | text: `--combobox-item-label-highlight` on `--combobox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | data-highlighted | text: `--combobox-item-label-highlight` on `--combobox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--combobox-chip-label` on `--combobox-chip-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--combobox-chip-label` on `--combobox-chip-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--combobox-chip-label` on `--combobox-chip-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## command

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--command-label` on `--command-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | data-[selected=true] | text: `--command-item-label-highlight` on `--command-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--command-label` on `--command-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | data-[selected=true] | text: `--command-item-label-highlight` on `--command-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--command-label` on `--command-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--command-input-wrapper-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | data-[selected=true] | text: `--command-item-label-highlight` on `--command-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--command-label` on `--command-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | data-[selected=true] | text: `--command-item-label-highlight` on `--command-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--command-label` on `--command-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--command-label` on `--command-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--command-label` on `--command-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | data-[selected=true] | text: `--command-item-label-highlight` on `--command-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | data-[selected=true] | text: `--command-item-label-highlight` on `--command-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | data-[selected=true] | text: `--command-item-label-highlight` on `--command-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## context-menu

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | focus | text: `--context-menu-sub-trigger-label-focus` on `--context-menu-sub-trigger-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | data-[state=open] | text: `--context-menu-sub-trigger-label-open` on `--context-menu-sub-trigger-background-open` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | rest | text: `--context-menu-sub-content-label` on `--context-menu-sub-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | rest | text: `--context-menu-content-label` on `--context-menu-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | focus | text: `--context-menu-item-label-focus` on `--context-menu-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | focus | text: `--context-menu-checkbox-item-label-focus` on `--context-menu-checkbox-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | focus | text: `--context-menu-radio-item-label-focus` on `--context-menu-radio-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | focus | text: `--context-menu-sub-trigger-label-focus` on `--context-menu-sub-trigger-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | data-[state=open] | text: `--context-menu-sub-trigger-label-open` on `--context-menu-sub-trigger-background-open` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | rest | text: `--context-menu-sub-content-label` on `--context-menu-sub-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | rest | text: `--context-menu-content-label` on `--context-menu-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | focus | text: `--context-menu-item-label-focus` on `--context-menu-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | focus | text: `--context-menu-checkbox-item-label-focus` on `--context-menu-checkbox-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | focus | text: `--context-menu-radio-item-label-focus` on `--context-menu-radio-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | focus | text: `--context-menu-sub-trigger-label-focus` on `--context-menu-sub-trigger-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | data-[state=open] | text: `--context-menu-sub-trigger-label-open` on `--context-menu-sub-trigger-background-open` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | text: `--context-menu-sub-content-label` on `--context-menu-sub-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--context-menu-sub-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | rest | text: `--context-menu-content-label` on `--context-menu-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--context-menu-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | focus | text: `--context-menu-item-label-focus` on `--context-menu-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | focus | text: `--context-menu-checkbox-item-label-focus` on `--context-menu-checkbox-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | focus | text: `--context-menu-radio-item-label-focus` on `--context-menu-radio-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | focus | text: `--context-menu-sub-trigger-label-focus` on `--context-menu-sub-trigger-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | data-[state=open] | text: `--context-menu-sub-trigger-label-open` on `--context-menu-sub-trigger-background-open` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | rest | text: `--context-menu-sub-content-label` on `--context-menu-sub-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | rest | text: `--context-menu-content-label` on `--context-menu-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | focus | text: `--context-menu-item-label-focus` on `--context-menu-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | focus | text: `--context-menu-checkbox-item-label-focus` on `--context-menu-checkbox-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | focus | text: `--context-menu-radio-item-label-focus` on `--context-menu-radio-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--context-menu-sub-trigger-label-focus` on `--context-menu-sub-trigger-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--context-menu-sub-trigger-label-focus` on `--context-menu-sub-trigger-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--context-menu-sub-trigger-label-focus` on `--context-menu-sub-trigger-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | data-[state=open] | text: `--context-menu-sub-trigger-label-open` on `--context-menu-sub-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | data-[state=open] | text: `--context-menu-sub-trigger-label-open` on `--context-menu-sub-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | data-[state=open] | text: `--context-menu-sub-trigger-label-open` on `--context-menu-sub-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--context-menu-sub-content-label` on `--context-menu-sub-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--context-menu-sub-content-label` on `--context-menu-sub-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--context-menu-sub-content-label` on `--context-menu-sub-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--context-menu-content-label` on `--context-menu-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--context-menu-content-label` on `--context-menu-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--context-menu-content-label` on `--context-menu-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--context-menu-item-label-focus` on `--context-menu-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--context-menu-item-label-focus` on `--context-menu-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--context-menu-item-label-focus` on `--context-menu-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--context-menu-checkbox-item-label-focus` on `--context-menu-checkbox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--context-menu-checkbox-item-label-focus` on `--context-menu-checkbox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--context-menu-checkbox-item-label-focus` on `--context-menu-checkbox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--context-menu-radio-item-label-focus` on `--context-menu-radio-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--context-menu-radio-item-label-focus` on `--context-menu-radio-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--context-menu-radio-item-label-focus` on `--context-menu-radio-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## data-table

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--data-table-container-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## dialog

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--dialog-content-label` on `--dialog-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | hover | text: `--dialog-close-label` on `--dialog-close-background-hover` | `#C4CBD6` on `#262D38` | `#C4CBD6` on `#0D1117` | 8.49 → 11.59 | 0.545 → 0.664 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--dialog-content-label` on `--dialog-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | hover | text: `--dialog-close-label` on `--dialog-close-background-hover` | `#CFC6B6` on `#2E2A24` | `#CFC6B6` on `#14110D` | 8.42 → 11.12 | 0.542 → 0.650 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--dialog-content-label` on `--dialog-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--dialog-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | hover | text: `--dialog-close-label` on `--dialog-close-background-hover` | `#D6D6D6` on `#222222` | `#D6D6D6` on `#141414` | 10.95 → 12.68 | 0.624 → 0.685 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--dialog-content-label` on `--dialog-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | hover | text: `--dialog-close-label` on `--dialog-close-background-hover` | `#E2C4B3` on `#33241F` | `#E2C4B3` on `#120B09` | 9.05 → 11.86 | 0.565 → 0.684 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--dialog-content-label` on `--dialog-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--dialog-content-label` on `--dialog-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--dialog-content-label` on `--dialog-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--dialog-close-label` on `--dialog-close-background-hover` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--dialog-close-label` on `--dialog-close-background-hover` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--dialog-close-label` on `--dialog-close-background-hover` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |

## drawer

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--drawer-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## dropdown-menu

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--dropdown-menu-content-label` on `--overlay-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| content-first/dark | rest | text: `--dropdown-menu-content-label` on `--overlay-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| accessible-first/dark | rest | text: `--dropdown-menu-content-label` on `--overlay-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--dropdown-menu-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| brand-expressive/dark | rest | text: `--dropdown-menu-content-label` on `--overlay-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--dropdown-menu-content-label` on `--overlay-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--dropdown-menu-content-label` on `--overlay-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--dropdown-menu-content-label` on `--overlay-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |

## empty

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--empty-icon-label` on `--empty-icon-background` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--empty-icon-label` on `--empty-icon-background` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--empty-icon-label` on `--empty-icon-background` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--empty-icon-label` on `--empty-icon-background` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--empty-icon-label` on `--empty-icon-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--empty-icon-label` on `--empty-icon-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--empty-icon-label` on `--empty-icon-background` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## field

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | has-[>[data-slot=field]] | border: `--field-label-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## hover-card

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--hover-card-content-label` on `--hover-card-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| content-first/dark | rest | text: `--hover-card-content-label` on `--hover-card-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| accessible-first/dark | rest | text: `--hover-card-content-label` on `--hover-card-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--hover-card-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| brand-expressive/dark | rest | text: `--hover-card-content-label` on `--hover-card-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--hover-card-content-label` on `--hover-card-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--hover-card-content-label` on `--hover-card-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--hover-card-content-label` on `--hover-card-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |

## input

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | text: `--input-text` on `--input-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#222222` | 17.20 → 14.85 | 0.785 → 0.724 | 0.000 / 0.061 | moved (approval) |

## item

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--item-outline-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | rest | border: `--item-media-icon-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## kbd

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--kbd-label` on `--kbd-background` | `#969FAD` on `#262D38` | `#969FAD` on `#0D1117` | 5.19 → 7.08 | 0.405 → 0.524 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--kbd-label` on `--kbd-background` | `#A39A8B` on `#2E2A24` | `#A39A8B` on `#14110D` | 5.13 → 6.77 | 0.403 → 0.510 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--kbd-label` on `--kbd-background` | `#B4B4B4` on `#222222` | `#B4B4B4` on `#141414` | 7.67 → 8.89 | 0.518 → 0.579 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--kbd-label` on `--kbd-background` | `#B5988A` on `#33241F` | `#B5988A` on `#120B09` | 5.54 → 7.26 | 0.426 → 0.544 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--kbd-label` on `--kbd-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--kbd-label` on `--kbd-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--kbd-label` on `--kbd-background` | `#96A3B5` on `#1E293B` | `#96A3B5` on `#020617` | 5.71 → 7.88 | 0.432 → 0.582 | 0.000 / 0.151 | moved (approval) |

## menubar

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--menubar-content-label` on `--menubar-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | focus | text: `--menubar-trigger-label-focus` on `--menubar-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | focus | text: `--menubar-item-label-focus` on `--menubar-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | data-[state=open] | text: `--menubar-content-label` on `--menubar-trigger-background-open` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | data-[variant=destructive] | text: `--menubar-item-label-destructive` on `--menubar-content-background` | `#F28B8B` on `#161B23` | `#F28B8B` on `#262D38` | 7.28 → 5.84 | 0.543 → 0.472 | 0.000 / 0.075 | moved (approval), WCAG level drop |
| dense-data/dark | focus | text: `--menubar-checkbox-item-label-focus` on `--menubar-checkbox-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | focus | text: `--menubar-radio-item-label-focus` on `--menubar-radio-item-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | rest | text: `--menubar-content-label` on `--menubar-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | focus | text: `--menubar-trigger-label-focus` on `--menubar-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | focus | text: `--menubar-item-label-focus` on `--menubar-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | data-[state=open] | text: `--menubar-content-label` on `--menubar-trigger-background-open` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | data-[variant=destructive] | text: `--menubar-item-label-destructive` on `--menubar-content-background` | `#F28B8B` on `#1F1B16` | `#F28B8B` on `#2E2A24` | 7.21 → 6.00 | 0.535 → 0.475 | 0.000 / 0.062 | moved (approval), WCAG level drop |
| content-first/dark | focus | text: `--menubar-checkbox-item-label-focus` on `--menubar-checkbox-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | focus | text: `--menubar-radio-item-label-focus` on `--menubar-radio-item-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--menubar-content-label` on `--menubar-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--menubar-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | rest | border: `--menubar-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | focus | text: `--menubar-trigger-label-focus` on `--menubar-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | focus | text: `--menubar-item-label-focus` on `--menubar-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | data-[state=open] | text: `--menubar-content-label` on `--menubar-trigger-background-open` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | data-[variant=destructive] | text: `--menubar-item-label-destructive` on `--menubar-content-background` | `#F28B8B` on `#141414` | `#F28B8B` on `#333333` | 7.76 → 5.32 | 0.570 → 0.444 | 0.000 / 0.130 | moved (approval), WCAG level drop |
| accessible-first/dark | focus | text: `--menubar-checkbox-item-label-focus` on `--menubar-checkbox-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | focus | text: `--menubar-radio-item-label-focus` on `--menubar-radio-item-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | rest | text: `--menubar-content-label` on `--menubar-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | focus | text: `--menubar-trigger-label-focus` on `--menubar-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | focus | text: `--menubar-item-label-focus` on `--menubar-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | data-[state=open] | text: `--menubar-content-label` on `--menubar-trigger-background-open` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | data-[variant=destructive] | text: `--menubar-item-label-destructive` on `--menubar-content-background` | `#F28B8B` on `#1F1411` | `#F28B8B` on `#33241F` | 7.58 → 6.26 | 0.553 → 0.481 | 0.000 / 0.072 | moved (approval), WCAG level drop |
| brand-expressive/dark | focus | text: `--menubar-checkbox-item-label-focus` on `--menubar-checkbox-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | focus | text: `--menubar-radio-item-label-focus` on `--menubar-radio-item-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--menubar-content-label` on `--menubar-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--menubar-content-label` on `--menubar-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--menubar-content-label` on `--menubar-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--menubar-trigger-label-focus` on `--menubar-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--menubar-trigger-label-focus` on `--menubar-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--menubar-trigger-label-focus` on `--menubar-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--menubar-item-label-focus` on `--menubar-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--menubar-item-label-focus` on `--menubar-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--menubar-item-label-focus` on `--menubar-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | data-[state=open] | text: `--menubar-content-label` on `--menubar-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | data-[state=open] | text: `--menubar-content-label` on `--menubar-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | data-[state=open] | text: `--menubar-content-label` on `--menubar-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | data-[variant=destructive] | text: `--menubar-item-label-destructive` on `--menubar-content-background` | `#F28B8B` on `#0F172A` | `#F28B8B` on `#1E293B` | 7.52 → 6.16 | 0.559 → 0.490 | 0.000 / 0.072 | moved (approval), WCAG level drop |
| multi-brand/birch-dark | data-[variant=destructive] | text: `--menubar-item-label-destructive` on `--menubar-content-background` | `#F28B8B` on `#0F172A` | `#F28B8B` on `#1E293B` | 7.52 → 6.16 | 0.559 → 0.490 | 0.000 / 0.072 | moved (approval), WCAG level drop |
| multi-brand/coral-dark | data-[variant=destructive] | text: `--menubar-item-label-destructive` on `--menubar-content-background` | `#F28B8B` on `#0F172A` | `#F28B8B` on `#1E293B` | 7.52 → 6.16 | 0.559 → 0.490 | 0.000 / 0.072 | moved (approval), WCAG level drop |
| multi-brand/aster-dark | focus | text: `--menubar-checkbox-item-label-focus` on `--menubar-checkbox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--menubar-checkbox-item-label-focus` on `--menubar-checkbox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--menubar-checkbox-item-label-focus` on `--menubar-checkbox-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--menubar-radio-item-label-focus` on `--menubar-radio-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--menubar-radio-item-label-focus` on `--menubar-radio-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--menubar-radio-item-label-focus` on `--menubar-radio-item-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## native-select

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | placeholder | text: `--native-select-label-placeholder` on `--native-select-field-background` | `#B4B4B4` on `#141414` | `#B4B4B4` on `#222222` | 8.89 → 7.67 | 0.579 → 0.518 | 0.000 / 0.061 | moved (approval) |

## navigation-menu

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | hover | text: `--navigation-menu-trigger-label-hover` on `--navigation-menu-trigger-background-hover` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | focus | text: `--navigation-menu-trigger-label-highlight` on `--navigation-menu-trigger-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | data-[state=open] | text: `--navigation-menu-trigger-label-open` on `--navigation-menu-trigger-background-open` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | group-data-[viewport=false]/navigation-menu | text: `--navigation-menu-content-label` on `--navigation-menu-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | rest | text: `--navigation-menu-viewport-label` on `--navigation-menu-viewport-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| dense-data/dark | hover | text: `--navigation-menu-link-label-hover` on `--navigation-menu-link-background-hover` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | focus | text: `--navigation-menu-link-label-focus` on `--navigation-menu-link-background-highlight` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | hover | text: `--navigation-menu-trigger-label-hover` on `--navigation-menu-trigger-background-hover` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | focus | text: `--navigation-menu-trigger-label-highlight` on `--navigation-menu-trigger-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | data-[state=open] | text: `--navigation-menu-trigger-label-open` on `--navigation-menu-trigger-background-open` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | group-data-[viewport=false]/navigation-menu | text: `--navigation-menu-content-label` on `--navigation-menu-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | rest | text: `--navigation-menu-viewport-label` on `--navigation-menu-viewport-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| content-first/dark | hover | text: `--navigation-menu-link-label-hover` on `--navigation-menu-link-background-hover` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | focus | text: `--navigation-menu-link-label-focus` on `--navigation-menu-link-background-highlight` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | hover | text: `--navigation-menu-trigger-label-hover` on `--navigation-menu-trigger-background-hover` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | focus | text: `--navigation-menu-trigger-label-highlight` on `--navigation-menu-trigger-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | data-[state=open] | text: `--navigation-menu-trigger-label-open` on `--navigation-menu-trigger-background-open` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | group-data-[viewport=false]/navigation-menu | text: `--navigation-menu-content-label` on `--navigation-menu-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | group-data-[viewport=false]/navigation-menu | border: `--navigation-menu-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | rest | text: `--navigation-menu-viewport-label` on `--navigation-menu-viewport-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--navigation-menu-viewport-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | hover | text: `--navigation-menu-link-label-hover` on `--navigation-menu-link-background-hover` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | focus | text: `--navigation-menu-link-label-focus` on `--navigation-menu-link-background-highlight` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | hover | text: `--navigation-menu-trigger-label-hover` on `--navigation-menu-trigger-background-hover` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | focus | text: `--navigation-menu-trigger-label-highlight` on `--navigation-menu-trigger-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | data-[state=open] | text: `--navigation-menu-trigger-label-open` on `--navigation-menu-trigger-background-open` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | group-data-[viewport=false]/navigation-menu | text: `--navigation-menu-content-label` on `--navigation-menu-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | rest | text: `--navigation-menu-viewport-label` on `--navigation-menu-viewport-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| brand-expressive/dark | hover | text: `--navigation-menu-link-label-hover` on `--navigation-menu-link-background-hover` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | focus | text: `--navigation-menu-link-label-focus` on `--navigation-menu-link-background-highlight` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--navigation-menu-trigger-label-hover` on `--navigation-menu-trigger-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--navigation-menu-trigger-label-hover` on `--navigation-menu-trigger-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--navigation-menu-trigger-label-hover` on `--navigation-menu-trigger-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--navigation-menu-trigger-label-highlight` on `--navigation-menu-trigger-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--navigation-menu-trigger-label-highlight` on `--navigation-menu-trigger-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--navigation-menu-trigger-label-highlight` on `--navigation-menu-trigger-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | data-[state=open] | text: `--navigation-menu-trigger-label-open` on `--navigation-menu-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | data-[state=open] | text: `--navigation-menu-trigger-label-open` on `--navigation-menu-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | data-[state=open] | text: `--navigation-menu-trigger-label-open` on `--navigation-menu-trigger-background-open` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | group-data-[viewport=false]/navigation-menu | text: `--navigation-menu-content-label` on `--navigation-menu-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | group-data-[viewport=false]/navigation-menu | text: `--navigation-menu-content-label` on `--navigation-menu-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | group-data-[viewport=false]/navigation-menu | text: `--navigation-menu-content-label` on `--navigation-menu-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--navigation-menu-viewport-label` on `--navigation-menu-viewport-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--navigation-menu-viewport-label` on `--navigation-menu-viewport-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--navigation-menu-viewport-label` on `--navigation-menu-viewport-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--navigation-menu-link-label-hover` on `--navigation-menu-link-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--navigation-menu-link-label-hover` on `--navigation-menu-link-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--navigation-menu-link-label-hover` on `--navigation-menu-link-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | focus | text: `--navigation-menu-link-label-focus` on `--navigation-menu-link-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | focus | text: `--navigation-menu-link-label-focus` on `--navigation-menu-link-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | focus | text: `--navigation-menu-link-label-focus` on `--navigation-menu-link-background-highlight` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## popover

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--popover-content-label` on `--popover-content-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| content-first/dark | rest | text: `--popover-content-label` on `--popover-content-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| accessible-first/dark | rest | text: `--popover-content-label` on `--popover-content-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--popover-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| brand-expressive/dark | rest | text: `--popover-content-label` on `--popover-content-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--popover-content-label` on `--popover-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--popover-content-label` on `--popover-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--popover-content-label` on `--popover-content-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |

## resizable

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--resizable-grip-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## select

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--select-content-label` on `--overlay-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| content-first/dark | rest | text: `--select-content-label` on `--overlay-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| accessible-first/dark | rest | text: `--select-trigger-text` on `--select-trigger-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#222222` | 17.20 → 14.85 | 0.785 → 0.724 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | text: `--select-content-label` on `--overlay-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| accessible-first/dark | rest | border: `--select-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| brand-expressive/dark | rest | text: `--select-content-label` on `--overlay-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--select-content-label` on `--overlay-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--select-content-label` on `--overlay-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--select-content-label` on `--overlay-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |

## sheet

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | hover | text: `--sheet-close-label` on `--sheet-close-background-hover` | `#C4CBD6` on `#262D38` | `#C4CBD6` on `#0D1117` | 8.49 → 11.59 | 0.545 → 0.664 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | hover | text: `--sheet-close-label` on `--sheet-close-background-hover` | `#CFC6B6` on `#2E2A24` | `#CFC6B6` on `#14110D` | 8.42 → 11.12 | 0.542 → 0.650 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | border: `--sheet-content-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | hover | text: `--sheet-close-label` on `--sheet-close-background-hover` | `#D6D6D6` on `#222222` | `#D6D6D6` on `#141414` | 10.95 → 12.68 | 0.624 → 0.685 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | hover | text: `--sheet-close-label` on `--sheet-close-background-hover` | `#E2C4B3` on `#33241F` | `#E2C4B3` on `#120B09` | 9.05 → 11.86 | 0.565 → 0.684 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--sheet-close-label` on `--sheet-close-background-hover` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--sheet-close-label` on `--sheet-close-background-hover` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--sheet-close-label` on `--sheet-close-background-hover` | `#CBD5E1` on `#1E293B` | `#CBD5E1` on `#020617` | 9.85 → 13.59 | 0.590 → 0.740 | 0.000 / 0.151 | moved (approval) |

## sidebar

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | hover | text: `--sidebar-group-action-label` on `--sidebar-group-action-background-hover` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | hover | text: `--sidebar-menu-action-label` on `--sidebar-menu-action-background-hover` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | hover | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-hover` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| dense-data/dark | active | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-pressed` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | hover | text: `--sidebar-group-action-label` on `--sidebar-group-action-background-hover` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | hover | text: `--sidebar-menu-action-label` on `--sidebar-menu-action-background-hover` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| content-first/dark | hover | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-hover` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | rest | text: `--sidebar-label` on `--sidebar-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#222222` | 17.20 → 14.85 | 0.785 → 0.724 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | border: `--sidebar-container-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | group-data-[variant=floating] | border: `--sidebar-inner-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | hover | text: `--sidebar-group-action-label` on `--sidebar-group-action-background-hover` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | hover | text: `--sidebar-menu-action-label` on `--sidebar-menu-action-background-hover` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | rest | border: `--sidebar-menu-sub-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |
| accessible-first/dark | hover | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-hover` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| accessible-first/dark | active | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-pressed` | `#F7F7F7` on `#333333` | `#F7F7F7` on `#0A0A0A` | 11.79 → 18.48 | 0.655 → 0.831 | 0.000 / 0.176 | moved (approval) |
| brand-expressive/dark | hover | text: `--sidebar-group-action-label` on `--sidebar-group-action-background-hover` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | hover | text: `--sidebar-menu-action-label` on `--sidebar-menu-action-background-hover` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| brand-expressive/dark | hover | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-hover` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--sidebar-group-action-label` on `--sidebar-group-action-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--sidebar-group-action-label` on `--sidebar-group-action-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--sidebar-group-action-label` on `--sidebar-group-action-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--sidebar-menu-action-label` on `--sidebar-menu-action-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--sidebar-menu-action-label` on `--sidebar-menu-action-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--sidebar-menu-action-label` on `--sidebar-menu-action-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--sidebar-menu-sub-button-label` on `--sidebar-menu-sub-button-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

## table

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--table-row-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## tabs

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | rest | border: `--tabs-list-border` on the page | `#333333` on `#0A0A0A` | `#595959` on `#0A0A0A` | 1.57 → 2.83 | 0.176 → 0.319 | 0.143 / 0.000 | moved (approval) |

## textarea

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accessible-first/dark | placeholder | text: `--textarea-label-placeholder` on `--textarea-background` | `#B4B4B4` on `#141414` | `#B4B4B4` on `#222222` | 8.89 → 7.67 | 0.579 → 0.518 | 0.000 / 0.061 | moved (approval) |

## toast

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | rest | text: `--toast-label` on `--toast-background` | `#F7F8FA` on `#161B23` | `#F7F8FA` on `#262D38` | 16.26 → 13.05 | 0.758 → 0.684 | 0.000 / 0.075 | moved (approval) |
| content-first/dark | rest | text: `--toast-label` on `--toast-background` | `#FFFDF8` on `#1F1B16` | `#FFFDF8` on `#2E2A24` | 16.84 → 14.03 | 0.769 → 0.707 | 0.000 / 0.062 | moved (approval) |
| accessible-first/dark | rest | text: `--toast-label` on `--toast-background` | `#F7F7F7` on `#141414` | `#F7F7F7` on `#333333` | 17.20 → 11.79 | 0.785 → 0.655 | 0.000 / 0.130 | moved (approval) |
| brand-expressive/dark | rest | text: `--toast-label` on `--toast-background` | `#FFF8F3` on `#1F1411` | `#FFF8F3` on `#33241F` | 17.12 → 14.14 | 0.779 → 0.707 | 0.000 / 0.072 | moved (approval) |
| multi-brand/aster-dark | rest | text: `--toast-label` on `--toast-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/birch-dark | rest | text: `--toast-label` on `--toast-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |
| multi-brand/coral-dark | rest | text: `--toast-label` on `--toast-background` | `#F8FAFC` on `#0F172A` | `#F8FAFC` on `#1E293B` | 17.06 → 13.98 | 0.777 → 0.705 | 0.000 / 0.072 | moved (approval) |

## toggle

| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dense-data/dark | hover | text: `--toggle-label` on `--toggle-background-hover` | `#F7F8FA` on `#262D38` | `#F7F8FA` on `#0D1117` | 13.05 → 17.81 | 0.684 → 0.803 | 0.000 / 0.119 | moved (approval) |
| content-first/dark | hover | text: `--toggle-label` on `--toggle-background-hover` | `#FFFDF8` on `#2E2A24` | `#FFFDF8` on `#14110D` | 14.03 → 18.51 | 0.707 → 0.814 | 0.000 / 0.107 | moved (approval) |
| accessible-first/dark | hover | text: `--toggle-label` on `--toggle-background-hover` | `#F7F7F7` on `#222222` | `#F7F7F7` on `#141414` | 14.85 → 17.20 | 0.724 → 0.785 | 0.000 / 0.061 | moved (approval) |
| brand-expressive/dark | hover | text: `--toggle-label` on `--toggle-background-hover` | `#FFF8F3` on `#33241F` | `#FFF8F3` on `#120B09` | 14.14 → 18.54 | 0.707 → 0.825 | 0.000 / 0.119 | moved (approval) |
| multi-brand/aster-dark | hover | text: `--toggle-label` on `--toggle-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/birch-dark | hover | text: `--toggle-label` on `--toggle-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |
| multi-brand/coral-dark | hover | text: `--toggle-label` on `--toggle-background-hover` | `#F8FAFC` on `#1E293B` | `#F8FAFC` on `#020617` | 13.98 → 19.28 | 0.705 → 0.856 | 0.000 / 0.151 | moved (approval) |

