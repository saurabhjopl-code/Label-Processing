// ===============================
// APP BOOTSTRAP
// ===============================

import { loadAllData } from "./data.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadAllData();
    console.log("🚀 App data ready");
  } catch (err) {
    console.error("❌ Data load failed", err);
    alert("Failed to load stock data. Please refresh.");
  }
});

