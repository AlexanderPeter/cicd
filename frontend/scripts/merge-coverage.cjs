const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { createCoverageMap } = require('istanbul-lib-coverage');
const { createContext } = require('istanbul-lib-report');
const reports = require('istanbul-reports');
const lcovParse = require('lcov-parse');

const ADDITIONAL_LCOV = 'coverage/lcov.info';
const E2E_JSON_DIR = 'coverage/e2e/json';
const OUTPUT_DIR = 'coverage/combined';
const OUTPUT_LCOV = path.join(OUTPUT_DIR, 'lcov.info');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const jsonFiles = glob.sync(`${E2E_JSON_DIR}/*.json`);

const coverageMap = createCoverageMap({});

for (const file of jsonFiles) {
  const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
  coverageMap.merge(content);
  console.log(`✅ Eingelesen: ${file}`);
}

if (fs.existsSync(ADDITIONAL_LCOV)) {
  console.log(`➕ Kombiniere mit bestehender LCOV: ${ADDITIONAL_LCOV}`);

  const lcovData = fs.readFileSync(ADDITIONAL_LCOV, 'utf-8');
  lcovParse(lcovData, (err, parsed) => {
    if (err) throw err;

    const additionalMap = createCoverageMap({});
    for (const entry of parsed) {
      const filename = entry.file;
      const lines = entry.lines.details;

      const coverageObj = {
        path: filename,
        statementMap: {},
        fnMap: {},
        branchMap: {},
        s: {},
        f: {},
        b: {},
      };

      for (const line of lines) {
        coverageObj.s[line.line] = line.hit;
        coverageObj.statementMap[line.line] = {
          start: { line: line.line, column: 0 },
          end: { line: line.line, column: 0 },
        };
      }

      additionalMap.addFileCoverage(coverageObj);
    }

    coverageMap.merge(additionalMap);

    writeLCOV(coverageMap);
  });
} else {
  writeLCOV(coverageMap);
}

function writeLCOV(map) {
  const context = createContext({
    dir: OUTPUT_DIR,
    coverageMap: map,
  });

  const report = reports.create('lcovonly', {});
  report.execute(context);

  console.log(`📄 Kombinierte Coverage geschrieben nach ${OUTPUT_LCOV}`);
}
