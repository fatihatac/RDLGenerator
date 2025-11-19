import * as Layout from "../constants/layoutConstants";

const ICON_WIDTH_PX = 35;

function getMaxCharWidth(data, key, headerText) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = "11px Trebuchet MS";

  let maxWidth = 0;
  if (headerText) {
    maxWidth = ctx.measureText(headerText).width + ICON_WIDTH_PX;
  }

  if (data && key) {
    const limit = Math.min(data.length, 100);
    let val = "";
    for (let i = 0; i < limit; i++) {
      val = data[i][key];
      if (val !== null && val !== undefined) {
        const strVal = ctx.measureText(String(val));
        if (strVal.width > maxWidth) {
          maxWidth = strVal.width;
        }
      }
    }
  }

  let calculatedWidth = maxWidth * 0.75; // pt dönüşümü

  return Math.round(calculatedWidth + Layout.PADDING);
}

export default getMaxCharWidth;
