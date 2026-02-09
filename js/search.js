// ===============================
// STYLE + SIZE + LABEL FLOW LOGIC
// ===============================

import { styleIndex, imageIndex } from "./data.js";

// DOM
const styleInput = document.querySelector("#styleSearch");
const dropdown = document.querySelector(".dropdown");
const sizeSection = document.querySelector(".size-section");
const sizeSelect = document.querySelector("#sizeSelect");
const labelInput = document.querySelector("#labelUnits");
const saveBtn = document.querySelector(".save-btn");

const imageEl = document.querySelector(".image-box img");
const titleEl = document.querySelector(".meta-title");
const categoryEl = document.querySelector(".meta-category");

// State
let selectedStyle = null;
let selectedSize = null;
let selectedSKU = null;

// Master sizes
const MASTER_SIZES = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL","7XL","8XL","9XL","10XL"
];

// -------------------------------
// INITIAL UI STATE
// -------------------------------
labelInput.disabled = true;
saveBtn.disabled = true;

// -------------------------------
// STYLE DROPDOWN
// -------------------------------
function renderDropdown(styles) {
  dropdown.innerHTML = "";

  styles.forEach(style => {
    const div = document.createElement("div");
    div.textContent = style;
    div.className = "dropdown-item";
    div.onclick = () => selectStyle(style);
    dropdown.appendChild(div);
  });

  dropdown.style.display = styles.length ? "block" : "none";
}

// -------------------------------
// STYLE SELECT
// -------------------------------
function selectStyle(style) {
  selectedStyle = style;
  styleInput.value = style;
  dropdown.style.display = "none";

  resetSizeAndLabel();
  populateSizeDropdown();
}

// -------------------------------
// SIZE DROPDOWN
// -------------------------------
function populateSizeDropdown() {
  sizeSelect.innerHTML = `<option value="">Select Size</option>`;

  const existingSizes = Object.keys(styleIndex[selectedStyle] || {});

  existingSizes.forEach(size => {
    const opt = document.createElement("option");
    opt.value = size;
    opt.textContent = size;
    sizeSelect.appendChild(opt);
  });

  const addOpt = document.createElement("option");
  addOpt.value = "__ADD_SIZE__";
  addOpt.textContent = "Add Size";
  sizeSelect.appendChild(addOpt);

  sizeSection.classList.remove("hidden");
}

// -------------------------------
// SIZE CHANGE
// -------------------------------
sizeSelect.addEventListener("change", () => {
  const value = sizeSelect.value;

  resetLabelOnly();

  if (!value) return;

  if (value === "__ADD_SIZE__") {
    showMissingSizeDropdown();
    return;
  }

  finalizeSize(value);
});

// -------------------------------
// ADD SIZE FLOW
// -------------------------------
function showMissingSizeDropdown() {
  removeMissingDropdown();

  const existingSizes = Object.keys(styleIndex[selectedStyle] || {});
  const missingSizes = MASTER_SIZES.filter(
    s => !existingSizes.includes(s)
  );

  if (!missingSizes.length) {
    alert("No additional sizes available.");
    sizeSelect.value = "";
    return;
  }

  const select = document.createElement("select");
  select.id = "missingSizeSelect";
  select.className = "size-select";

  select.innerHTML = `<option value="">Select Missing Size</option>`;

  missingSizes.forEach(size => {
    const opt = document.createElement("option");
    opt.value = size;
    opt.textContent = size;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    if (select.value) {
      finalizeSize(select.value);
      removeMissingDropdown();
    }
  });

  sizeSection.appendChild(select);
}

function removeMissingDropdown() {
  const el = document.querySelector("#missingSizeSelect");
  if (el) el.remove();
}

// -------------------------------
// FINALIZE SIZE
// -------------------------------
function finalizeSize(size) {
  selectedSize = size;
  sizeSelect.value = size;

  selectedSKU = styleIndex[selectedStyle][size] || null;

  if (selectedSKU) {
    updateImage(selectedSKU);
  }

  // Enable label input
  labelInput.disabled = false;
  labelInput.focus();
}

// -------------------------------
// LABEL UNITS LOGIC
// -------------------------------
labelInput.addEventListener("input", () => {
  const val = Number(labelInput.value);
  saveBtn.disabled = !(val > 0);
});

// -------------------------------
// IMAGE UPDATE
// -------------------------------
function updateImage(sku) {
  const img = imageIndex[sku];
  if (!img) return;

  imageEl.src = img.image;
  titleEl.textContent = img.title || "";
  categoryEl.textContent = img.category || "";
}

// -------------------------------
// RESET HELPERS
// -------------------------------
function resetSizeAndLabel() {
  sizeSelect.value = "";
  removeMissingDropdown();
  resetLabelOnly();
}

function resetLabelOnly() {
  labelInput.value = "";
  labelInput.disabled = true;
  saveBtn.disabled = true;
}

// -------------------------------
// INIT
// -------------------------------
export function initStyleSearch() {
  styleInput.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      dropdown.style.display = "none";
      return;
    }

    const matches = Object.keys(styleIndex)
      .filter(s => s.toLowerCase().includes(q))
      .slice(0, 10);

    renderDropdown(matches);
  });
}
