console.log("🔥 app.js loaded");

import { loadAllData } from "./data.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🔥 DOMContentLoaded fired");

  try {
    await loadAllData();
    console.log("🚀 App data ready");
  } catch (err) {
    console.error("❌ DATA LOAD ERROR:", err);
    alert("Failed to load stock data. Check console.");
  }
});
