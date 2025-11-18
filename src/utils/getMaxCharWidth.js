import * as Layout from "../constants/layoutConstants"

const ICON_WIDTH_PX = 50; 

function getMaxCharWidth(data, key, headerText) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = "10px Trebuchet MS";

  let maxWidth = 0;
  if (headerText) {
    maxWidth = ctx.measureText(headerText).width + ICON_WIDTH_PX;
  }

  const limit = Math.min(data.length, 100);
  let val = ""
  for (let i = 0; i < limit; i++) {
    val = data[i][key];
      if (val !== null && val !== undefined) {
      const strVal = ctx.measureText(String(val));
      if (strVal.width > maxWidth) {
        maxWidth = strVal.width
      }
    }
  }

  let calculatedWidth = maxWidth * 0.75 
  console.log("değişti");
  
  return Math.round(calculatedWidth + Layout.PADDING);
}

export default getMaxCharWidth;
