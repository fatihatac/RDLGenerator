import * as Layout from "../../constants/layoutConstants";

const ICON_WIDTH_PX = 35;

// FIX: SSR/test ortamlarında document olmayabilir; guard eklendi.
// Singleton canvas context lazy olarak başlatılıyor.
let _sharedCtx = null;

function getSharedContext() {
  if (typeof document === "undefined") return null; // SSR guard
  if (!_sharedCtx) {
    const canvas = document.createElement("canvas");
    _sharedCtx = canvas.getContext("2d");
    _sharedCtx.font = "11px Trebuchet MS";
  }
  return _sharedCtx;
}

function getMaxCharWidth(data, key, headerText) {
  const ctx = getSharedContext();
  if (!ctx) return Layout.COLUMN_WIDTH; // SSR fallback

  let maxWidth = 0;

  if (headerText) {
    maxWidth = ctx.measureText(headerText).width + ICON_WIDTH_PX;
  }

  if (data && key) {
    const limit = Math.min(data.length, 100);
    for (let i = 0; i < limit; i++) {
      const currentValue = data[i][key];
      if (currentValue !== null && currentValue !== undefined) {
        const w = ctx.measureText(String(currentValue)).width;
        if (w > maxWidth) maxWidth = w;
      }
    }
  }

  const calculatedWidth = maxWidth * 0.75; // px → pt dönüşümü
  return Math.round(calculatedWidth + Layout.PADDING);
}

export default getMaxCharWidth;
