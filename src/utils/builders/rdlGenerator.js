import useReportStore from "../../store/useReportStore.js";
import { generateStandardRDL } from "./generators/standartRDL.js";
import { generatePDY00146 } from "./generators/pdy00146.js";
import { REPORT_TYPES } from "../../constants/reportTypes.js";

function generateRDL(items) {
  const { reportType } = useReportStore.getState();

  if (reportType === REPORT_TYPES.PDY00146) {
    return generatePDY00146(items);
  }

  return generateStandardRDL(items);
}

export { generateRDL };
