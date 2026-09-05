#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { translate } from "../src/translator.js";

const VERSION = "1.0.0";

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
JAK v${VERSION}

Javanese-inspired programming language that compiles to JavaScript.

Usage:
  jak <file.jk>
  jak <file.jk> -o <file.js>

Commands:
  jak <file.jk>             Compile .jk to .js
  jak build <file.jk>       Compile .jk to .js
  jak run <file.jk>         Compile and run the JavaScript
  jak init                  Create a new JAK project

Options:
  -o, --output <file>       Output JavaScript file
  -v, --version             Show version
  -h, --help                Show help

Examples:
  jak test.jk
  jak test.jk -o test.js
  jak build test.jk -o dist/test.js
  jak run test.jk
  jak init
`);
}

function printVersion() {
  console.log(`JAK v${VERSION}`);
}

function error(message) {
  console.error(`\nJAK Error: ${message}\n`);
  process.exit(1);
}

function compile(input, output) {
  if (!fs.existsSync(input)) {
    error(`File "${input}" tidak ditemukan.`);
  }

  const stat = fs.statSync(input);

  if (!stat.isFile()) {
    error(`"${input}" bukan sebuah file.`);
  }

  if (!input.toLowerCase().endsWith(".jk")) {
    error(`File input harus menggunakan ekstensi .jk`);
  }

  let source;

  try {
    source = fs.readFileSync(input, "utf8");
  } catch (err) {
    error(`Gagal membaca file: ${err.message}`);
  }

  let result;

  try {
    result = translate(source);
  } catch (err) {
    error(`Gagal menerjemahkan kode: ${err.message}`);
  }

  if (!output) {
    output = path.basename(input, ".jk") + ".js";
  }

  const outputDir = path.dirname(output);

  if (outputDir !== ".") {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    fs.writeFileSync(output, result, "utf8");
  } catch (err) {
    error(`Gagal menulis output: ${err.message}`);
  }

  console.log(`✓ Compiled ${input} → ${output}`);

  return output;
}

function runFile(input) {
  const output = path.join(
    process.cwd(),
    ".jak-cache",
    path.basename(input, ".jk") + ".js"
  );

  const compiled = compile(input, output);

  console.log(`\n▶ Running ${input}\n`);

  const result = spawnSync(
    process.execPath,
    [compiled],
    {
      stdio: "inherit"
    }
  );

  if (result.error) {
    error(`Gagal menjalankan program: ${result.error.message}`);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function initProject() {
  const files = {
    "main.jk": `ono nama = "World"

tampilno("Hello " + nama)
`,
    "jak.config.json": JSON.stringify(
      {
        entry: "main.jk",
        output: "dist/main.js"
      },
      null,
      2
    )
  };

  for (const [file, content] of Object.entries(files)) {
    if (fs.existsSync(file)) {
      console.log(`! Skipped ${file}, file sudah ada.`);
      continue;
    }

    fs.writeFileSync(file, content, "utf8");
    console.log(`✓ Created ${file}`);
  }

  console.log(`
Project JAK berhasil dibuat.

Jalankan:
  jak run main.jk

Build:
  jak build main.jk -o dist/main.js
`);
}

function parseOutput(args) {
  const index = args.findIndex(
    arg => arg === "-o" || arg === "--output"
  );

  if (index === -1) {
    return null;
  }

  const value = args[index + 1];

  if (!value || value.startsWith("-")) {
    error("Option -o membutuhkan nama file output.");
  }

  return value;
}

function main() {
  if (args.length === 0) {
    printHelp();
    return;
  }

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  if (args.includes("--version") || args.includes("-v")) {
    printVersion();
    return;
  }

  if (args[0] === "init") {
    initProject();
    return;
  }

  const command = args[0];

  if (command === "run") {
    const input = args[1];

    if (!input) {
      error("Masukkan file .jk yang ingin dijalankan.");
    }

    runFile(input);
    return;
  }

  if (command === "build") {
    const input = args[1];

    if (!input) {
      error("Masukkan file .jk yang ingin di-build.");
    }

    const output = parseOutput(args);

    compile(input, output);
    return;
  }

  if (command.startsWith("-")) {
    error(`Unknown option "${command}". Gunakan "jak --help".`);
  }

  const input = command;
  const output = parseOutput(args);

  compile(input, output);
}

main();
