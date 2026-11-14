// The package folder (ADR-002 sections 8 and 11): one folder that holds a scheme for download. It has
// the manifest, the overlay, the lockfile and the built file. open-ds export writes it, and
// open-ds create --from reads it. The lockfile's hashes are checked when the folder is read, so a
// changed or cut file fails before anything is written.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { emptyOverlay } from "./overlay.mjs";
import { joinProject, json, lockFor, overlayValidator, packageInfo, PROJECT_FILES, projectScheme, readLock, sha256 } from "./project.mjs";
import { schemeValidator } from "./build.mjs";
import { assetRoots, grammar, loadScheme, storedScheme } from "./schemes.mjs";

/** The manifest's file name, and the format version a change to the folder's shape raises. */
export const MANIFEST = "manifest.json";
export const PACKAGE_FORMAT = 1;

/** The manifest of a package folder: what the scheme is, where it comes from and which files hold it. */
export function manifestFor({ scheme, lock }) {
  return {
    $comment: "Written by open-ds export. Read by open-ds create --from. Do not edit: the lockfile's hashes check the files.",
    format: PACKAGE_FORMAT,
    scheme: { id: scheme.id, name: scheme.name, version: scheme.version },
    source: { scheme: lock.chain[0].scheme, version: lock.chain[0].version },
    package: lock.package,
    files: { overlay: PROJECT_FILES.overlay, lock: PROJECT_FILES.lock, built: PROJECT_FILES.built },
  };
}

/** Write a package folder: { manifest.json, overlay.json, open-ds.lock, build/scheme.json }. Returns the paths written. */
export function writePackageFolder(out, { overlayText, lockText, builtText }) {
  const lock = JSON.parse(lockText);
  const files = {
    [PROJECT_FILES.overlay]: overlayText,
    [PROJECT_FILES.lock]: lockText,
    [PROJECT_FILES.built]: builtText,
  };
  files[MANIFEST] = json(manifestFor({ scheme: JSON.parse(builtText), lock }));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(out, rel)), { recursive: true });
    writeFileSync(join(out, rel), text);
  }
  return Object.keys(files);
}

/**
 * Export a scheme as a package folder. From a project (dir has overlay.json): its overlay, lockfile and
 * built file, which must be current. From a scheme id: the source with an empty overlay, joined and checked.
 */
export function exportPackage({ schemeId, dir, out, roots = assetRoots() }) {
  if (!schemeId) {
    if (!projectScheme(dir)) throw new Error(`${dir} is not a project with ${PROJECT_FILES.overlay}. Name a scheme instead: open-ds export <scheme> --out <folder>`);
    const read = (rel) => readFileSync(join(dir, rel), "utf8");
    return writePackageFolder(out, { overlayText: read(PROJECT_FILES.overlay), lockText: read(PROJECT_FILES.lock), builtText: read(PROJECT_FILES.built) });
  }
  const source = loadScheme(schemeId, roots);
  const g = grammar(roots);
  const overlay = emptyOverlay(source);
  const overlayText = json(overlay);
  const r = joinProject({
    source,
    overlay,
    g,
    stored: storedScheme(source.id, roots),
    validate: schemeValidator(roots),
    validateOverlay: overlayValidator(roots),
  });
  if (!r.ok) throw new Error(`${schemeId} fails its checks: ${[...r.problems, ...r.results.flatMap((x) => x.findings)].slice(0, 5).join("; ")}`);
  const lock = lockFor({ source, g, overlay, overlayText, builtHash: r.hash });
  return writePackageFolder(out, { overlayText, lockText: json(lock), builtText: r.text });
}

/**
 * Read and check a package folder. Fails with a plain message when a file is missing, the format is
 * newer than this open-ds reads, or a file does not match its hash in the lockfile.
 * Returns { manifest, overlay, lock, built }.
 */
export function readPackageFolder(folder) {
  const path = (rel) => join(folder, rel);
  if (!existsSync(path(MANIFEST))) throw new Error(`${folder} has no ${MANIFEST}. Give the folder that open-ds export wrote.`);
  const manifest = JSON.parse(readFileSync(path(MANIFEST), "utf8"));
  if (manifest.format !== PACKAGE_FORMAT)
    throw new Error(`${folder} is package format ${manifest.format}, and this open-ds reads format ${PACKAGE_FORMAT}. Install the open-ds version in ${MANIFEST}.`);
  const missing = Object.values(manifest.files ?? {}).filter((rel) => !existsSync(path(rel)));
  if (missing.length) throw new Error(`${folder} is missing ${missing.join(", ")}. Export it again.`);
  const lock = readLock(folder);
  const overlayText = readFileSync(path(manifest.files.overlay), "utf8");
  const builtText = readFileSync(path(manifest.files.built), "utf8");
  if (sha256(overlayText) !== lock.overlay.sha256) throw new Error(`${manifest.files.overlay} in ${folder} does not match ${PROJECT_FILES.lock}. The file changed after export. Export it again.`);
  if (sha256(builtText) !== lock.built.sha256) throw new Error(`${manifest.files.built} in ${folder} does not match ${PROJECT_FILES.lock}. The file changed after export. Export it again.`);
  return { manifest, lock, overlay: JSON.parse(overlayText), built: JSON.parse(builtText) };
}

/** The source of a package folder from the installed open-ds. Fails when it is not the source the lockfile names. */
export function packageSource(pkg, roots = assetRoots()) {
  const link = pkg.lock.chain[0];
  const source = loadScheme(link.scheme, roots);
  if (sha256(json(source)) !== link.sha256)
    throw new Error(
      `The folder was built on ${link.scheme} from open-ds ${pkg.lock.package.version}, and the installed open-ds ${packageInfo().version} has another ${link.scheme} source. Install open-ds@${pkg.lock.package.version}, or create the project and run: open-ds upgrade`,
    );
  return source;
}
