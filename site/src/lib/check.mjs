/** Recipe checks for the browser. Python in validator/ is the reference. */

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

export async function checkRecipe(recipe, packs) {
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
      if (!selected(picks, effect)) {
        findings.push(
          finding(
            "recommend",
            "info",
            "A recommended option was not selected.",
            qid,
            option.id,
            link(effect),
          ),
        );
      }
    }
    for (const effect of option.discourages || []) {
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
  const done = finish(findings, recipe, packs, questions);
  if (!done.ok) return { ok: false, findings: done.findings };
  return { ok: true, findings: done.findings, fingerprint: await fingerprintRecipe(recipe) };
}

export { effectTargets, questionsFor };
