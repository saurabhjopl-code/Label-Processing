// ===============================
// DATA LOADER & INDEXER
// ===============================

import { UNIWARE_CSV_URL, IMAGE_CSV_URL } from "./config.js";

// In-memory stores
export let uniwareRows = [];
export let styleIndex = {};
export let imageIndex = {};

// -------------------------------
// CSV PARSER
// -------------------------------
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

// -------------------------------
// LOAD UNIWARE STOCK
// -------------------------------
async function loadUniwareStock() {
  const res = await fetch(UNIWARE_CSV_URL);
  const text = await res.text();
  uniwareRows = parseCSV(text);

  /*
    Expected headers:
    Sku Code | Style ID | Size | Stock
  */

  styleIndex = {};

  uniwareRows.forEach(row => {
    const sku = row["Sku Code"];
    const style = row["Style ID"];
    const size = row["Size"];

    if (!styleIndex[style]) {
      styleIndex[style] = {};
    }

    if (!styleIndex[style][size]) {
      styleIndex[style][size] = sku;
    }
  });
}

// -------------------------------
// LOAD IMAGE MASTER
// -------------------------------
async function loadImageMaster() {
  const res = await fetch(IMAGE_CSV_URL);
  const text = await res.text();
  const rows = parseCSV(text);

  imageIndex = {};

  rows.forEach(row => {
    const sku = row["SKU"];
    imageIndex[sku] = {
      image: row["ImageLink"],
      title: row["Title"],
      category: row["Category"]
    };
  });
}

// -------------------------------
// PUBLIC INIT
// -------------------------------
export async function loadAllData() {
  await Promise.all([
    loadUniwareStock(),
    loadImageMaster()
  ]);

  console.log("✅ Uniware rows:", uniwareRows.length);
  console.log("✅ Styles loaded:", Object.keys(styleIndex).length);
  console.log("✅ Images loaded:", Object.keys(imageIndex).length);
}

