import useReportStore from "../../store/useReportStore.js";
import { generateStandardRDL } from "./generators/standartRDL.js";

function generateRDL(items) {
  return generateStandardRDL(items);
}

export { generateRDL };
