// src/utils/builders/rdlGenerator.js

import useReportStore from "../../store/useReportStore.js";
import { REPORT_TYPES } from "../../constants/reportTypes.js";
import { generateStandardRDL } from "./generators/standartRDL.js";
// İleride buraya eklenecek:
// import { generateCustomRDL } from "./generators/customRdlGenerator.js";

function generateRDL(items) {
  // Store'dan güncel rapor tipini alıyoruz
  const currentReportType = useReportStore.getState().reportType;

  switch (currentReportType) {
    case REPORT_TYPES.STANDARD:
      return generateStandardRDL(items);
      
    // Yeni rapor tipi eklendiğinde burası aktif edilecek
    // case REPORT_TYPES.CUSTOM_TYPE_1:
    //   return generateCustomRDL(items); 

    default:
      console.warn("Unknown report type selected. Falling back to STANDARD.");
      return generateStandardRDL(items);
  }
}

export { generateRDL };