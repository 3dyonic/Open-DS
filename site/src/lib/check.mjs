/**
 * Browser mirror of the Python validator in validator/.
 * Python is the single source of truth.
 * site/src/lib/fixtures.test.mjs runs the shared fixtures against this file
 * and against validator/tests/test_fixtures.py. A mismatch fails the node CI job.
 */

const SEVERITY = { error: 0, warning: 1, info: 2 };

function finding(id, severity, message, question = "", option = "", extra = {}) {
  const row = { id, severity, message };
  if (question) row.question = question;
  if (option) row.option = option;
  for (const [key, value] of Object.entries(extra)) {
    if (value) row[key] = value;
  }
  return row;
}

function sortFindings(items) {
  return [...items].sort((a, b) => {
    const rank = SEVERITY[a.severity] - SEVERITY[b.severity];
    if (rank) return rank;
    if (a.id !== b.id) return a.id < b.id ? -1 : 1;
    const aq = a.question || "";
    const bq = b.question || "";
    if (aq !== bq) return aq < bq ? -1 : 1;
    const ao = a.option || "";
    const bo = b.option || "";
    if (ao === bo) return 0;
    return ao < bo ? -1 : 1;
  });
}

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortValue(value[key]);
    return out;
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(sortValue(value));
}

export function normalizeRecipe(recipe) {
  const picks = [...(recipe.picks || [])]
    .sort((a, b) => (a.question < b.question ? -1 : a.question > b.question ? 1 : 0))
    .map((pick) => ({
      option: pick.option || "",
      params: pick.params || {},
      question: pick.question || "",
      rationale: String(pick.rationale || "").trim(),
    }));
  return {
    id: recipe.id || "",
    name: recipe.name || "",
    packs: [...(recipe.packs || [])],
    picks,
    provisional: Boolean(recipe.provisional),
    serves: String(recipe.serves || "").trim(),
    summary: String(recipe.summary || "").trim(),
    version: recipe.version || "",
  };
}

export function canonicalRecipe(recipe) {
  return canonicalJson(normalizeRecipe(recipe));
}

export function shareCode(recipe) {
  const bytes = new TextEncoder().encode(canonicalRecipe(recipe));
  let binary = "";
  for (const part of bytes) binary += String.fromCharCode(part);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export async function fingerprintRecipe(recipe) {
  const data = new TextEncoder().encode(canonicalRecipe(recipe));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((part) => part.toString(16).padStart(2, "0")).join("");
}

function materialize(raw, packs) {
  if (!raw.ref) return structuredClone(raw);
  const gid = raw.ref.split(":")[1];
  const base = packs.global.questions.find((item) => item.id === gid);
  const merged = structuredClone(base);
  merged.id = raw.id;
  merged.prompt = raw.prompt || base.prompt;
  merged.summary = raw.summary || base.summary;
  merged.required = raw.required ?? base.required ?? true;
  merged.ref = raw.ref;
  const options = Object.fromEntries(merged.options.map((item) => [item.id, item]));
  const order = merged.options.map((item) => item.id);
  for (const override of raw.overrides || []) {
    if (!order.includes(override.id)) order.push(override.id);
    options[override.id] = structuredClone(override);
  }
  merged.options = order.map((id) => options[id]);
  return merged;
}

function questionsFor(packs, packIds) {
  const ordered = [...packIds].sort((a, b) => {
    if (a === "purpose") return -1;
    if (b === "purpose") return 1;
    return packs[a].order - packs[b].order;
  });
  const seen = new Map();
  const order = [];
  for (const pid of ordered) {
    for (const raw of packs[pid].questions) {
      const question = raw.ref ? materialize(raw, packs) : structuredClone(raw);
      question.pack = pid;
      if (seen.has(question.id)) {
        if (raw.overrides || raw.ref) seen.set(question.id, question);
        continue;
      }
      seen.set(question.id, question);
      order.push(question.id);
    }
  }
  return order.map((id) => seen.get(id));
}

function effectTargets(effect) {
  if (effect.options) return effect.options;
  if (effect.option) return [effect.option];
  return [];
}

const TEXT_RATIO = 4.5;
const NON_TEXT_RATIO = 3;
const RESIZE_PERCENT = 200;
const SPACING_FLOORS = [
  ["lineHeight", 1.5],
  ["paragraphSpacing", 2],
  ["letterSpacing", 0.12],
  ["wordSpacing", 0.16],
];
const TARGET_PX = 24;
const CONFIRM_FLAGS = new Set(["destructive", "payment", "legal-commitment"]);
const HIDDEN_BY = new Set(["hover", "accordion"]);
const MSG_RESIZE = "Text must resize to 200% without loss of content (WCAG 2.2 1.4.4).";
const MSG_SPACING =
  "Text spacing must allow line height 1.5, paragraph spacing 2, letter spacing 0.12, and word spacing 0.16 (WCAG 2.2 1.4.12).";
const MSG_TARGET = "Targets must be at least 24px or have sufficient spacing (WCAG 2.2 2.5.8).";

function wordCount(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

function declaredNumber(block, key) {
  if (!block || typeof block !== "object" || !(key in block)) return undefined;
  const value = block[key];
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function belowFloor(value, minimum) {
  return value === undefined || value === null || value < minimum;
}

function floorSection(floors, key, requireComplete) {
  if (!floors || typeof floors !== "object" || !(key in floors)) return requireComplete ? {} : null;
  const block = floors[key];
  return block && typeof block === "object" ? block : {};
}

function floorBlockFindings(floors, requireComplete) {
  const source = floors && typeof floors === "object" ? floors : requireComplete ? {} : null;
  if (!source) return [];
  const findings = [];
  const contrast = floorSection(source, "contrast", requireComplete);
  if (contrast) {
    const problems = [];
    if (belowFloor(declaredNumber(contrast, "text"), TEXT_RATIO)) {
      problems.push("text contrast is below 4.5:1");
    }
    if (belowFloor(declaredNumber(contrast, "nonText"), NON_TEXT_RATIO)) {
      problems.push("non-text contrast is below 3:1");
    }
    if (problems.length) {
      findings.push(
        finding("floor-contrast", "error", `${problems.join("; ")} (WCAG 2.2 1.4.3 and 1.4.11).`),
      );
    }
  }
  const resize = floorSection(source, "resize", requireComplete);
  if (
    resize &&
    (belowFloor(declaredNumber(resize, "textResizePercent"), RESIZE_PERCENT) ||
      resize.contentLost === true)
  ) {
    findings.push(finding("floor-resize", "error", MSG_RESIZE));
  }
  const spacing = floorSection(source, "textSpacing", requireComplete);
  if (
    spacing &&
    SPACING_FLOORS.some(([key, minimum]) => belowFloor(declaredNumber(spacing, key), minimum))
  ) {
    findings.push(finding("floor-text-spacing", "error", MSG_SPACING));
  }
  const target = floorSection(source, "targetSize", requireComplete);
  if (target) {
    const minPx = declaredNumber(target, "minPx");
    const sizeOk = typeof minPx === "number" && minPx >= TARGET_PX;
    if (!sizeOk && target.sufficientSpacing !== true) {
      findings.push(finding("floor-target-size", "error", MSG_TARGET));
    }
  }
  for (const component of Array.isArray(source.components) ? source.components : []) {
    const cid = component.id || "component";
    const flagged = (component.flags || []).filter((flag) => CONFIRM_FLAGS.has(flag));
    if (flagged.length && component.confirms !== true) {
      findings.push(
        finding(
          "floor-confirm-destructive",
          "error",
          `${cid} is marked ${flagged.join(", ")} and has no confirmation (WCAG 2.2 3.3.4).`,
        ),
      );
    }
    if (component.critical === true && HIDDEN_BY.has(component.hiddenBy)) {
      findings.push(
        finding(
          "coga.critical-not-hidden",
          "error",
          `${cid} is critical and hidden behind ${component.hiddenBy}.`,
        ),
      );
    }
  }
  return findings;
}

function baseFloorFindings(packs) {
  if (!packs?.global) return [];
  return floorBlockFindings(packs.global.floors, true);
}

function resolvedOptions(question, packs) {
  if (question.ref && packs.global) return materialize(question, packs).options || [];
  return [...(question.options || []), ...(question.overrides || [])];
}

function backingTargets(question, packs) {
  const targets = new Set();
  for (const option of resolvedOptions(question, packs)) {
    for (const key of ["requires", "discourages", "recommends"]) {
      for (const effect of option[key] || []) {
        if (effect.question) targets.add(effect.question);
      }
    }
  }
  return targets;
}

function validatePackFields(packs, options = {}) {
  const findings = [];
  const known = new Set();
  for (const pack of Object.values(packs || {})) {
    for (const question of pack.questions || []) known.add(question.id);
  }
  const fragmentExists = options.fragmentExists;
  for (const pack of Object.values(packs || {})) {
    for (const question of pack.questions || []) {
      if (Array.isArray(question.affects) && question.affects.length === 0) {
        findings.push(
          finding("empty-affects", "warning", "affects is empty.", question.id, "", {
            scheme: pack.id,
          }),
        );
      }
      if (typeof question.why_care === "string" && wordCount(question.why_care) > 25) {
        findings.push(
          finding(
            "why-care-length",
            "error",
            "why_care is longer than 25 words.",
            question.id,
            "",
            { scheme: pack.id },
          ),
        );
      }
      const backed = backingTargets(question, packs);
      for (const target of question.feeds_into || []) {
        if (!known.has(target)) {
          findings.push(
            finding(
              "unknown-feeds-into",
              "error",
              "feeds_into points at an unknown question.",
              question.id,
              "",
              { scheme: pack.id },
            ),
          );
          continue;
        }
        if (!backed.has(target)) {
          findings.push(
            finding(
              "unbacked-feeds-into",
              "error",
              "feeds_into has no requires, discourages, or recommends rule.",
              question.id,
              "",
              { scheme: pack.id },
            ),
          );
        }
      }
      if (typeof fragmentExists !== "function") continue;
      for (const option of resolvedOptions(question, packs)) {
        if (!option.fragment || fragmentExists(option.fragment)) continue;
        findings.push(
          finding(
            "missing-fragment",
            "error",
            "The fragment file does not exist.",
            question.id,
            option.id,
            { scheme: pack.id },
          ),
        );
      }
    }
  }
  return findings;
}

function whenState(picks, effect) {
  const clauses = effect.when;
  if (!clauses || (Array.isArray(clauses) && clauses.length === 0)) return "always";
  const list = Array.isArray(clauses) ? clauses : [clauses];
  let missing = false;
  let mismatched = false;
  for (const clause of list) {
    const pick = picks[clause.question];
    if (!pick) {
      missing = true;
      continue;
    }
    if (pick.option !== clause.option) mismatched = true;
  }
  if (missing) return "partial";
  if (mismatched) return "miss";
  return "match";
}

function prefillRows(effect, option) {
  return effectTargets(effect).map((target) => ({
    question: effect.question || "",
    option: target,
    reason: effect.reason || "",
    ...(option.label ? { because: option.label } : {}),
  }));
}

function selected(picks, effect) {
  const pick = picks[effect.question];
  if (!pick) return false;
  if (effect.options) return effect.options.includes(pick.option);
  return pick.option === effect.option;
}

function checkParam(spec, value, question, option) {
  const findings = [];
  if (spec.type === "string") {
    if (typeof value !== "string")
      return [finding("param-type", "error", `${spec.id} must be a string.`, question, option)];
    if (spec.pattern) {
      const body = spec.pattern.replace(/^\^/, "").replace(/\$$/, "");
      if (!new RegExp(`^${body}$`).test(value)) {
        findings.push(
          finding(
            "param-pattern",
            "error",
            `${spec.id} does not match the pattern.`,
            question,
            option,
          ),
        );
      }
    }
  } else if (spec.type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      return [finding("param-type", "error", `${spec.id} must be an integer.`, question, option)];
    }
  } else if (spec.type === "number") {
    if (typeof value !== "number")
      return [finding("param-type", "error", `${spec.id} must be a number.`, question, option)];
  } else {
    return [finding("param-type", "error", `${spec.id} has an unknown type.`, question, option)];
  }
  if (spec.minimum !== undefined && value < spec.minimum) {
    findings.push(
      finding("param-range", "error", `${spec.id} is below the minimum.`, question, option),
    );
  }
  if (spec.maximum !== undefined && value > spec.maximum) {
    findings.push(
      finding("param-range", "error", `${spec.id} is above the maximum.`, question, option),
    );
  }
  return findings;
}

function schemeFor(packs, questionId, questions) {
  if (!questionId) return "";
  const resolved = (questions || []).find((item) => item.id === questionId);
  if (resolved?.pack) return resolved.pack;
  if (!packs) return "";
  for (const pack of Object.values(packs)) {
    if ((pack.questions || []).some((item) => item.id === questionId)) return pack.id;
  }
  return "";
}

function stampScheme(findings, packs, questions) {
  return findings.map((item) => {
    if (item.scheme || !item.question) return item;
    const scheme = schemeFor(packs, item.question, questions);
    return scheme ? { ...item, scheme } : item;
  });
}

function fail(findings, packs, questions) {
  return { ok: false, findings: sortFindings(stampScheme(findings, packs, questions)) };
}

function finish(findings, recipe, packs, questions) {
  const ordered = sortFindings(stampScheme(findings, packs, questions));
  if (ordered.some((item) => item.severity === "error")) return { ok: false, findings: ordered };
  if (!recipe) return { ok: true, findings: ordered };
  return { ok: true, findings: ordered, recipe };
}

export function missingQuestionReport(findings) {
  const missing = findings.filter((item) => item.id === "missing-question");
  return {
    summary: missing.length ? `${missing.length} questions still need an answer.` : "",
    lines: missing.map(
      (item) => `${item.question} has no answer yet. Pick one to finish your recipe.`,
    ),
  };
}

export async function checkRecipe(recipe, packs, options = {}) {
  const findings = [];
  if (
    !recipe ||
    typeof recipe !== "object" ||
    !Array.isArray(recipe.picks) ||
    !Array.isArray(recipe.packs)
  ) {
    return fail(
      [finding("recipe-schema", "error", "The recipe is missing packs or picks.")],
      packs,
    );
  }
  if (!String(recipe.serves || "").trim() || !recipe.id || !recipe.name || !recipe.version) {
    return fail(
      [finding("recipe-schema", "error", "The recipe is missing an id, name, version, or serves.")],
      packs,
    );
  }
  for (const pick of recipe.picks) {
    if (
      !pick.question ||
      !pick.option ||
      typeof pick.rationale !== "string" ||
      pick.rationale.length < 1 ||
      pick.rationale.length > 280
    ) {
      findings.push(
        finding(
          "recipe-schema",
          "error",
          "A pick is missing a rationale of 1 to 280 characters.",
          pick.question || "",
        ),
      );
    }
  }
  if (findings.length) return fail(findings, packs);

  const early = [...validatePackFields(packs, options), ...baseFloorFindings(packs)];
  if (early.some((item) => item.severity === "error")) return fail(early, packs);
  findings.push(...early);

  for (const pid of recipe.packs) {
    if (!packs[pid]) findings.push(finding("unknown-pack", "error", `Unknown pack ${pid}.`));
  }
  if (findings.length) return fail(findings, packs);

  const questions = questionsFor(packs, recipe.packs);
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]));
  const purposeIds = new Set(packs.purpose.questions.map((question) => question.id));
  const picks = {};
  const seen = new Set();
  for (const pick of recipe.picks) {
    if (seen.has(pick.question)) {
      findings.push(
        finding("duplicate-question", "error", "This question is answered twice.", pick.question),
      );
      continue;
    }
    seen.add(pick.question);
    picks[pick.question] = pick;
  }
  if (![...Object.keys(picks)].some((id) => purposeIds.has(id))) {
    findings.push(
      finding(
        "missing-purpose",
        "error",
        "A recipe with no Purpose picks is not accepted.",
        "",
        "",
        { scheme: "purpose" },
      ),
    );
  }
  for (const question of questions) {
    if ((question.required ?? true) && !picks[question.id]) {
      findings.push(
        finding("missing-question", "error", "This required question has no answer.", question.id),
      );
    }
  }
  const prefills = [];
  const selectedFragments = [];
  for (const [qid, pick] of Object.entries(picks)) {
    const question = byId[qid];
    if (!question) {
      findings.push(
        finding("unknown-question", "error", "This question is not in the selected packs.", qid),
      );
      continue;
    }
    const option = (question.options || []).find((item) => item.id === pick.option);
    if (!option) {
      findings.push(
        finding("unknown-option", "error", "This option is not a cited answer.", qid, pick.option),
      );
      continue;
    }
    if (option.fragment) selectedFragments.push(option.fragment);
    const rationale = String(pick.rationale || "").trim();
    if (!rationale)
      findings.push(
        finding(
          "missing-rationale",
          "error",
          "Write a rationale in your own words.",
          qid,
          option.id,
        ),
      );
    else if (rationale.length > 280)
      findings.push(
        finding(
          "rationale-length",
          "error",
          "The rationale must be 1 to 280 characters.",
          qid,
          option.id,
        ),
      );
    const params = pick.params || {};
    const specs = Object.fromEntries((option.parameters || []).map((spec) => [spec.id, spec]));
    for (const spec of option.parameters || []) {
      if (spec.required && !(spec.id in params)) {
        findings.push(
          finding("missing-param", "error", `Missing parameter ${spec.id}.`, qid, option.id),
        );
      }
    }
    for (const [key, value] of Object.entries(params)) {
      if (!specs[key]) {
        findings.push(
          finding("unknown-param", "error", `Unknown parameter ${key}.`, qid, option.id),
        );
        continue;
      }
      findings.push(...checkParam(specs[key], value, qid, option.id));
    }
    for (const effect of option.depends_on || []) {
      if (!selected(picks, effect))
        findings.push(
          finding(
            "missing-dependency",
            "error",
            "A required dependency is not selected.",
            qid,
            option.id,
          ),
        );
    }
    for (const effect of option.conflicts_with || []) {
      if (selected(picks, effect))
        findings.push(
          finding("conflict", "error", "This answer conflicts with another pick.", qid, option.id),
        );
    }
    const link = (effect) => ({
      targetQuestion: effect.question || "",
      targetOption: effect.option || "",
      reason: effect.reason || "",
      because: option.label,
    });
    for (const effect of option.requires || []) {
      if (!selected(picks, effect)) {
        findings.push(
          finding(
            "required-option",
            "error",
            "This answer requires another option.",
            qid,
            option.id,
            link(effect),
          ),
        );
      }
    }
    for (const effect of option.recommends || []) {
      const state = whenState(picks, effect);
      if (state === "match") prefills.push(...prefillRows(effect, option));
      else if (state === "miss" && selected(picks, effect)) {
        findings.push(
          finding(
            "discourage",
            "warning",
            "A discouraged option was selected.",
            qid,
            option.id,
            link(effect),
          ),
        );
      }
    }
    for (const effect of option.discourages || []) {
      const state = whenState(picks, effect);
      if (state === "partial" || state === "miss") continue;
      if (selected(picks, effect)) {
        findings.push(
          finding(
            "discourage",
            "warning",
            "A discouraged option was selected.",
            qid,
            option.id,
            link(effect),
          ),
        );
      }
    }
  }
  if (typeof options.readFragment === "function") {
    for (const fragment of selectedFragments) {
      const data = options.readFragment(fragment);
      if (!data || typeof data !== "object" || !data.floors) continue;
      findings.push(...floorBlockFindings(data.floors, false));
    }
  }
  prefills.sort((a, b) => {
    const left = `${a.question}\0${a.option}\0${a.reason}`;
    const right = `${b.question}\0${b.option}\0${b.reason}`;
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  });
  const done = finish(findings, recipe, packs, questions);
  const withPrefills = (result) => (prefills.length ? { ...result, prefills } : result);
  if (!done.ok) return withPrefills({ ok: false, findings: done.findings });
  return withPrefills({
    ok: true,
    findings: done.findings,
    fingerprint: await fingerprintRecipe(recipe),
  });
}

export { effectTargets, questionsFor };
