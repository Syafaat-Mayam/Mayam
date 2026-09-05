#!/usr/bin/env node

const fs = require('fs');
const { translate } = require('./translator');

function showHelp() {
  console.log(`
  🏙️  MAYAM - JavaScript Translator
  
  Pake:
    mayam <file>           Translate file .mym ke .js
    mayam <file> -o <out>  Tentukan output file
    mayam --help           Tampilkan bantuan
    mayam --version        Tampilkan versi
  
  Contoh:
    mayam test.mym
    mayam test.mym -o hasil.js
  `);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    const pkg = require('../package.json');
    console.log(`mayam v${pkg.version}`);
    return;
  }
  
  let inputFile = null;
  let outputFile = null;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' && i + 1 < args.length) {
      outputFile = args[i + 1];
      i++;
    } else if (!inputFile) {
      inputFile = args[i];
    }
  }
  
  if (!inputFile) {
    console.error('❌ Error: File input harus ditentukan!');
    console.log('Pake: mayam --help buat bantuan');
    process.exit(1);
  }
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: File "${inputFile}" gak ditemukan!`);
    process.exit(1);
  }
  
  const code = fs.readFileSync(inputFile, 'utf8');
  
  try {
    const result = translate(code);
    if (!outputFile) {
      outputFile = inputFile.replace(/\.mym$/, '.js');
      if (outputFile === inputFile) {
        outputFile = inputFile + '.js';
      }
    }
    fs.writeFileSync(outputFile, result, 'utf8');
    console.log(`✅ Sukses! "${inputFile}" -> "${outputFile}"`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, showHelp };
