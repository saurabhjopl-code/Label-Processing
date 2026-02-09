import { UNIWARE_CSV_URL, IMAGE_CSV_URL } from "./config.js";

export let uniwareRows = [];
export let styleIndex = {};
export let imageIndex = {};

// ---------------- CSV PARSER ----------------
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines.shift().split(",").map(h => h.trim());

  return lines.map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });
}

// ---------------- LOAD UNIWARE ----------------
async function loadUniwareStock() {
  console.log("🔄 Loading Uniware CSV...");
  const res = await fetch(UNIWARE_CSV_URL);

  if (!res.ok) {
    throw new Error("Uniware CSV fetch failed: " + res.status);
  }

  const text = await res.text();
  uniwareRows = parseCSV(text);

  styleIndex = {};

  uniwareRows.forEach(row => {
    const sku = row["Sku Code"];
    const style = row["Style ID"];
    const size = row["Size"];

    if (!style) return;

    if (!styleIndex[style]) {
      styleIndex[style] = {};
    }

    styleIndex[style][size] = sku;
  });

  console.log("✅ Uniware rows:", uniwareRows.length);
  console.log("✅ Styles loaded:", Object.keys(styleIndex).length);
}

// ---------------- LOAD IMAGE MASTER ----------------
async function loadImageMaster() {
  console.log("🔄 Loading Image Master CSV...");
  const res = await fetch(IMAGE_CSV_URL);

  if (!res.ok) {
    throw new Error("Image CSV fetch failed: " + res.status);
  }

  const text = await res.text();
  const rows = parseCSV(text);

  imageIndex = {};

  rows.forEach(row => {
    const sku = row["SKU"];
    if (!sku) return;

    imageIndex[sku] = {
      image: row["ImageLink"],
      title: row["Title"],
      category: row["Category"]
    };
  });

  console.log("✅ Images loaded:", Object.keys(imageIndex).length);
}

// ---------------- INIT ----------------
export async function loadAllData() {
  await loadUniwareStock();
  await loadImageMaster();
}
