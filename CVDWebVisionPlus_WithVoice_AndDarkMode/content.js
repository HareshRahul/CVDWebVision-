chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "applyColorAidFilter") {
    applyDaltonization(request.visionType);
  }
  if (request.type === "toggleLabelSwatches") {
    request.enabled ? labelColorSwatches() : document.querySelectorAll('.cvd-label').forEach(e => e.remove());
  }
  if (request.type === "toggleChartEnhancer") {
    if (request.enabled) recolorCharts();
  }
});

function applyDaltonization(type) {
  const existing = document.getElementById("daltonize-style");
  if (existing) existing.remove();
  if (type === "none") return;

  const style = document.createElement("style");
  style.id = "daltonize-style";
  style.innerHTML = `html { filter: url(#${type}) !important; }`;
  document.head.appendChild(style);
}

function labelColorSwatches() {
  const swatches = document.querySelectorAll("div, span, li");
  swatches.forEach(el => {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (!bg || bg === "rgba(0, 0, 0, 0)") return;
    const label = document.createElement("div");
    label.className = "cvd-label";
    label.innerText = getColorName(bg);
    label.style.cssText = "font-size:10px;color:#000;background:#fff;border:1px solid #ccc;padding:2px 4px;border-radius:4px;position:relative;top:2px;";
    el.appendChild(label);
  });
}
function getColorName(rgb) {
  if (rgb.includes("255, 0, 0")) return "Red";
  if (rgb.includes("0, 128, 0")) return "Green";
  if (rgb.includes("0, 0, 255")) return "Blue";
  if (rgb.includes("128, 0, 128")) return "Purple";
  if (rgb.includes("255, 255, 0")) return "Yellow";
  return "Color";
}
function recolorCharts() {
  const canvases = document.querySelectorAll("canvas");
  canvases.forEach(canvas => {
    canvas.style.outline = "3px dashed orange";
  });
}