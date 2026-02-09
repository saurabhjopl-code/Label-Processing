// ===============================
// APP BOOTSTRAP
// ===============================

import { loadAllData } from "./data.js";
import { initStyleSearch } from "./search.js";

console.log("🔥 app.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🔥 DOMContentLoaded fired");

  try {
    await loadAllData();
    console.log("🚀 App data ready");

    initStyleSearch();
  } catch (err) {
    console.error("❌ DATA LOAD ERROR:", err);
    alert("Failed to load stock data. Check console.");
  }
});
