#!/usr/bin/env node

const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const pluginModule = require('../src/typescript-plugin-civet.cjs');

function main() {
  const projectDir = path.resolve(__dirname, 'fixtures');
  const configPath = path.join(projectDir, 'tsconfig.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    console.error(configFile.error);
    process.exit(1);
  }
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, projectDir);
  const host = ts.createCompilerHost(parsed.options);
  host.getCurrentDirectory = () => projectDir;
  host.getScriptFileNames = () => parsed.fileNames.map(f => path.isAbsolute(f) ? f : path.join(projectDir, f));
  host.getScriptVersion = () => '0';
  host.getScriptSnapshot = (fileName) => {
    if (!fs.existsSync(fileName)) return undefined;
    const text = fs.readFileSync(fileName, 'utf8');
    return ts.ScriptSnapshot.fromString(text);
  };
  host.getCompilationSettings = () => parsed.options;

  const ls = ts.createLanguageService(host, ts.createDocumentRegistry());

  pluginModule.create({ languageServiceHost: host, languageService: ls });

  // Snapshot test: ensure .civet files compile
  const sampleFile = path.join(projectDir, 'sample.civet');
  const snap = host.getScriptSnapshot(sampleFile);
  if (!snap) {
    console.error('Failed to get snapshot for sample.civet');
    process.exit(1);
  }
  const compiled = snap.getText(0, snap.getLength());
  if (!compiled.includes('return 42')) {
    console.error('Compiled code does not contain expected output');
    process.exit(1);
  }
  console.log('✅ Plugin snapshot test passed: .civet snapshot produces compiled code');

  // Definition mapping test: go-to-definition for foo()
  const testFilePath = path.join(projectDir, 'test.ts');
  const testSnapshot = host.getScriptSnapshot(testFilePath);
  if (!testSnapshot) {
    console.error('Failed to get snapshot for test.ts');
    process.exit(1);
  }
  const testText = testSnapshot.getText(0, testSnapshot.getLength());
  const position = testText.indexOf('foo(');
  const defs = ls.getDefinitionAndBoundSpan(testFilePath, position);
  if (!defs || !defs.definitions || defs.definitions.length === 0) {
    console.error('No definitions found');
    process.exit(1);
  }
  const def = defs.definitions[0];
  if (!def.fileName.endsWith('sample.civet')) {
    console.error('Definition not pointing to sample.civet, got', def.fileName);
    process.exit(1);
  }
  console.log('✅ Plugin definition mapping test passed: go-to-definition to sample.civet');
}

main(); 