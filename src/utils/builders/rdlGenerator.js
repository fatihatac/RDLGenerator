import useReportStore from "../../store/useReportStore.js";
import { REPORT_TYPES } from "../../constants/reportTypes.js";
import { REPORT_TEMPLATES } from "../../constants/reportTemplates.js";
import { generateStandardRDL } from "./generators/standartRDL.js";
import { generateFormRDL } from "./generators/formRDL.js";

function generateRDL(items) {
  const currentReportType = useReportStore.getState().reportType;

  if (currentReportType === REPORT_TYPES.STANDARD) {
    return generateStandardRDL(items);
  }

  const templateConfig = REPORT_TEMPLATES[currentReportType];
  if (templateConfig) {
    return generateFormRDL(items, templateConfig);
  }

  console.warn(`Bilinmeyen rapor tipi: "${currentReportType}". Standart rapor kullanılıyor.`);
  return generateStandardRDL(items);
}

export { generateRDL };
