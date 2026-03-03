import * as Layout from "../../constants/layoutConstants";

const ICON_WIDTH_PX = 35;

let sharedCanvasContext = null;

function getSharedContext() {
  if (!sharedCanvasContext) {
    const canvas = document.createElement("canvas");
    sharedCanvasContext = canvas.getContext("2d");
    sharedCanvasContext.font = "11px Trebuchet MS";
  }
  return sharedCanvasContext;
}

function getMaxCharWidth(data, key, headerText) {
  const ctx = getSharedContext();

  let maxWidth = 0;

  if (headerText) {
    maxWidth = ctx.measureText(headerText).width + ICON_WIDTH_PX;
  }

  if (data && key) {
    const limit = Math.min(data.length, 100);
    let currentValue = "";

    for (let i = 0; i < limit; i++) {
      currentValue = data[i][key];
      if (currentValue !== null && currentValue !== undefined) {
        const textMetrics = ctx.measureText(String(currentValue));
        if (textMetrics.width > maxWidth) {
          maxWidth = textMetrics.width;
        }
      }
    }
  }

  let calculatedWidth = maxWidth * 0.75; // pt dönüşümü

  return Math.round(calculatedWidth + Layout.PADDING);
}

export default getMaxCharWidth;
