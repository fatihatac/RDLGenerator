// ---------------------------------------------------------------------------
// utils/index.js
// FIX: Tüm export'lar named (isimli) export olarak birleştirildi.
// Default export yalnızca tek sınıf/bileşen döndüren modüller için kullanılır.
// ---------------------------------------------------------------------------

export { default as generateId } from "./helpers/generateId";
export { default as parseAndExtractJsonInfo } from "./core/parseAndExtractJsonInfo";
export { default as fixColumnNames } from "./helpers/fixColumnNames";
export { default as getDataType } from "./helpers/getDataType";
export { default as getMaxCharWidth } from "./core/getMaxCharWidth";
export { default as convertTitleCase } from "./helpers/convertTitleCase";

export { flattenData } from "./helpers/flattenData";
export { escapeXml } from "./helpers/escapeXml";

export { generateRDL } from "./builders/rdlGenerator";
export { handleDataUpdateSideEffects } from "./core/reportLogic";
export { calculateReportValues } from "./core/reportCalculations";
export { buildReportItems } from "./builders/buildItems";
export { buildTable } from "./builders/buildTable";
export { buildTitle } from "./builders/buildTitle";
export { buildGroupHierarchy } from "./builders/buildGroupHierarchy";
export { default as buildDataSection } from "./builders/buildDataSection";
export { default as buildDateRange } from "./builders/buildDateRange";
export { default as buildChart } from "./builders/buildChart";
