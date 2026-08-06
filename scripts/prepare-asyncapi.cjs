/**
 * Prepares a temporary copy of the VDA5050 AsyncAPI document for vacuum linting.
 *
 * vacuum (and Redocly) resolve external JSON Schema references by file
 * extension. The VDA5050 canonical schemas under standards/VDA5050/json_schemas
 * use the extension-less `.schema` names, which those tools cannot resolve.
 *
 * Only the VDA5050 document needs this workaround. The MRIS document
 * (fleet-control/mris.yaml) references our own, properly named `.schema.json`
 * files and is linted directly against the original files.
 *
 * This script builds a temp mirror preserving the relative layout:
 *   - copies each *.schema -> *.schema.json
 *   - copies vda5050.yaml and rewrites its $refs to the renamed schemas
 *
 * The linting itself is left entirely to vacuum; this script only prepares files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(ROOT, '.tmp', 'asyncapi');

const DOC = 'fleet-control/vda5050.yaml';

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyAndRenameSchemas() {
  const schemasDir = path.join(ROOT, 'standards', 'VDA5050', 'json_schemas');
  const targetDir = path.join(TMP, 'standards', 'VDA5050', 'json_schemas');
  fs.mkdirSync(targetDir, { recursive: true });
  for (const file of fs.readdirSync(schemasDir)) {
    if (file.endsWith('.schema')) {
      const src = path.join(schemasDir, file);
      const dst = path.join(targetDir, file + '.json');
      fs.copyFileSync(src, dst);
    }
  }
}

function copyDocWithRewrittenRefs() {
  const srcPath = path.join(ROOT, DOC);
  const dstPath = path.join(TMP, DOC);
  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  let content = fs.readFileSync(srcPath, 'utf8');
  // Rewrite canonical .schema refs to the renamed .schema.json copies.
  content = content.replace(/\.schema(?=\s*$)/gm, '.schema.json');
  fs.writeFileSync(dstPath, content);
}

cleanDir(TMP);
copyAndRenameSchemas();
copyDocWithRewrittenRefs();

// Print the mirrored doc path for vacuum to lint.
console.log(path.join(TMP, DOC));