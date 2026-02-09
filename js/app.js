import { loadAllData } from "./data.js";
import { initStyleSearch } from "./search.js";

console.log("🔥 app.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🔥 DOMContentLoaded fired");

  try {
    await loadAllData();
    console.log("🚀 App data ready");

    initStyleSearch(); // UI wiring
  } catch (err) {
    console.error("❌ RUNTIME ERROR:", err);
    alert("Application error. Check console.");
  }
});
