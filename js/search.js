// ===============================
// STYLE SEARCH LOGIC
// ===============================

import { styleIndex, imageIndex } from "./data.js";

const styleInput = document.querySelector("#styleSearch");
const dropdown = document.querySelector(".dropdown");
const sizeSection = document.querySelector(".size-section");
const sizeSelect = document.querySelector(".size-select");
const imageEl = document.querySelector(".image-box img");
const titleEl = document.querySelector(".meta-title");
const categoryEl = document.querySelector(".meta-category");

let selectedStyle = null;
let selectedSKU = null;

// -------------------------------
// BUILD DROPDOWN
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
// STYLE SELECTION
// -------------------------------
function selectStyle(style) {
  selectedStyle = style;
  styleInput.value = style;
  dropdown.style.display = "none";

  populateSizes(style);
}

// -------------------------------
// SIZE POPULATION
// -------------------------------
function populateSizes(style) {
  sizeSelect.innerHTML = `<option>Select Size</option>`;

  const sizes = Object.keys(styleIndex[style] || {});
  if (!sizes.length) {
    sizeSelect.innerHTML += `<option>Add Size</option>`;
  } else {
    sizes.forEach(size => {
      const opt = document.createElement("option");
      opt.value = size;
      opt.textContent = size;
      sizeSelect.appendChild(opt);
    });
  }

  sizeSection.classList.remove("hidden");
}

// -------------------------------
// SIZE CHANGE
// -------------------------------
sizeSelect.addEventListener("change", () => {
  const size = sizeSelect.value;
  if (!size || size === "Select Size") return;

  selectedSKU = styleIndex[selectedStyle][size];
  updateImage(selectedSKU);
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
// INPUT LISTENER
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

