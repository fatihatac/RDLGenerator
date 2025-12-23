import * as Layout from "../constants/layoutConstants.js";
import { calculateReportValues } from "./reportCalculations.js";
import { XMLBuilder } from "fast-xml-parser";
import buildDataSection from "./buildDataSection.js";
import { buildReportItems } from "./buildItems.js";

function generateRDL(items) {
  const {
    TOTAL_REPORT_WIDTH,
    TOTAL_REPORT_HEIGHT,
  } = calculateReportValues(items);

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: "@_",
    suppressEmptyNode: true,
  });


  const allDataItems = items.filter(item => item.type === "data");
  const dataSetMap = {};
  const dataSourceMap = {};

  allDataItems.forEach((item, index) => {
    dataSetMap[item.id] = `DataSet${index + 1}`;
    dataSourceMap[item.id] = `DataSource${index + 1}`;
  });

  const reportItemsList = buildReportItems(items, TOTAL_REPORT_WIDTH,TOTAL_REPORT_HEIGHT, dataSetMap)
  console.log(items);
  
  let allDataSources = [];
  let allDataSets = [];

  allDataItems.forEach(dataItem => {
    const currentDataSetName = dataSetMap[dataItem.id];
    const currentDataSourceName = dataSourceMap[dataItem.id];
    const { DataSources, DataSets } = buildDataSection(dataItem, currentDataSetName, currentDataSourceName);
    
    if (DataSources && DataSources.DataSource) {
      allDataSources.push(DataSources.DataSource);
    }
    if (DataSets && DataSets.DataSet) {
      allDataSets.push(DataSets.DataSet);
    }
  });

  const reportObj = {
    Report: {
      "@_xmlns:df":
        "http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition/defaultfontfamily",
      "@_xmlns:rd":
        "http://schemas.microsoft.com/SQLServer/reporting/reportdesigner",
      "@_xmlns":
        "http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition",
      ReportSections: {
        ReportSection: {
          Body: {
            Style: { Border: { Style: "None" } },
            ReportItems: reportItemsList,
            Height: `${TOTAL_REPORT_HEIGHT}pt`,
          },
          Width: `${TOTAL_REPORT_WIDTH}pt`,
          Page: {
            LeftMargin: "72.00021pt",
            RightMargin: "72.00021pt",
            TopMargin: "72.00021pt",
            BottomMargin: "72.00021pt",
            Style: { Border: { Style: "None" } },
          },
        },
      },
      AutoRefresh: "0",
      ...(allDataSources.length > 0 && { DataSources: { DataSource: allDataSources } }),
      ...(allDataSets.length > 0 && { DataSets: { DataSet: allDataSets } }),
      ReportParametersLayout: {
        GridLayoutDefinition: {
          NumberOfColumns: "4",
          NumberOfRows: "2",
        },
      },
      "rd:ReportUnitType": "Inch",
      "rd:PageUnit": "Px",
      "df:DefaultFontFamily": Layout.FONT_FAMILY,
    },
  };

  const xmlOutput = builder.build(reportObj);

  return `<?xml version="1.0"?>\n${xmlOutput}`;
}

export { generateRDL };
