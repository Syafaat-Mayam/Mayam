const KEYWORDS = [
  ["kalo", "if"],
  ["kagak", "else"],
  ["kalo_gak", "else if"],
  ["pilih", "switch"],
  ["kasus", "case"],
  ["standar", "default"],
  ["berenti", "break"],
  ["lanjut", "continue"],
  ["balikin", "return"],
  ["coba", "try"],
  ["tangkap", "catch"],
  ["bikin", "throw"],
  ["akhirnya", "finally"],
  ["ada", "let"],
  ["tetep", "const"],
  ["ubah", "var"],
  ["kerjain", "function"],
  ["class", "class"],
  ["baru", "new"],
  ["ini", "this"],
  ["turunan", "extends"],
  ["panggil", "super"],
  ["ulang", "for"],
  ["selagi", "while"],
  ["kerjain_dulu", "do"],
  ["bawa", "import"],
  ["keluarin", "export"],
  ["keluarin_default", "export default"],
  ["tunggu", "await"],
  ["async", "async"],
  ["hapus", "delete"],
  ["ada_gak", "in"],
  ["jenis", "typeof"],
  ["instanceof", "instanceof"],
  ["kosong", "void"],
  ["with", "with"],
  ["debugger", "debugger"],
  ["tunjukin", "console.log"],
  ["tunjukin_error", "console.error"],
  ["tunjukin_warning", "console.warn"],
  ["tunjukin_info", "console.info"],
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translate(code) {
  let js = code;
  const sorted = [...KEYWORDS].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of sorted) {
    const regex = new RegExp(`\\b${escapeRegex(from)}\\b`, "g");
    js = js.replace(regex, to);
  }
  return js;
}

module.exports = { translate, KEYWORDS };
