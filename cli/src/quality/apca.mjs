// APCA 0.0.98G-4g: the lightness contrast (Lc) of text on a background, from the public formula
// (github.com/Myndex/apca-w3, constants of the 0.0.98G-4g release). Positive Lc is dark text on a
// light background; negative is light text on a dark one. Pure: two hex colors in, a number out.

const MAIN_TRC = 2.4;
const R_CO = 0.2126729;
const G_CO = 0.7151522;
const B_CO = 0.072175;
const NORM_BG = 0.56;
const NORM_TXT = 0.57;
const REV_TXT = 0.62;
const REV_BG = 0.65;
const BLACK_THRESHOLD = 0.022;
const BLACK_CLAMP = 1.414;
const SCALE = 1.14;
const LOW_OFFSET = 0.027;
const DELTA_Y_MIN = 0.0005;
const LOW_CLIP = 0.1;

/** The screen luminance APCA reads from a #RRGGBB color: a plain 2.4 power curve, no linear toe. */
export function apcaY(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return R_CO * r ** MAIN_TRC + G_CO * g ** MAIN_TRC + B_CO * b ** MAIN_TRC;
}

const soft = (y) => (y > BLACK_THRESHOLD ? y : y + (BLACK_THRESHOLD - y) ** BLACK_CLAMP);

/** Lc of text on a background, both #RRGGBB. */
export function apcaContrast(text, background) {
  const t = soft(apcaY(text));
  const b = soft(apcaY(background));
  if (Math.abs(b - t) < DELTA_Y_MIN) return 0;
  if (b > t) {
    const sapc = (b ** NORM_BG - t ** NORM_TXT) * SCALE;
    return sapc < LOW_CLIP ? 0 : (sapc - LOW_OFFSET) * 100;
  }
  const sapc = (b ** REV_BG - t ** REV_TXT) * SCALE;
  return sapc > -LOW_CLIP ? 0 : (sapc + LOW_OFFSET) * 100;
}

/**
 * The smallest |Lc| a pair needs, from the WCAG ratio the grammar asks of it. The steps follow the
 * APCA readability levels: Lc 75 for body text, 60 for content text, 45 for large text and 30 for
 * non-text marks.
 */
export function apcaFloor(wcagRatio) {
  if (wcagRatio >= 7) return 75;
  if (wcagRatio >= 4.5) return 60;
  if (wcagRatio >= 3) return 45;
  return 30;
}
