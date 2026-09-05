const KEYWORDS = [
  // Harus diletakkan sebelum "yen"
  ["yen ora", "else"],

  // Condition
  ["yen", "if"],

  // Variable
  ["ono", "let"],

  // Output
  ["tampilno", "console.log"]
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function translate(code) {
  let js = code;

  for (const [from, to] of KEYWORDS) {
    const regex = new RegExp(
      `\\b${escapeRegex(from)}\\b`,
      "g"
    );

    js = js.replace(regex, to);
  }

  return js;
}
