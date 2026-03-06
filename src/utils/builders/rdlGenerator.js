import {
  calculateReportValues,
  computePositions,
} from "../core/reportCalculations.js";
import { XMLBuilder } from "fast-xml-parser";
import buildDataSection from "./buildDataSection.js";
import { buildReportItems } from "./buildItems.js";
import useLayoutStore from "../../store/useLayoutStore.js";

function generateRDL(items) {
  // Zustand'ın getState() hook dışında da çalışır
  const settings = useLayoutStore.getState().layoutSettings;

  // 1. Boyut hesapları (settings'e duyarlı)
  const { TOTAL_REPORT_WIDTH, TOTAL_REPORT_HEIGHT } = calculateReportValues(
    items,
    settings,
  );

  // 2. Her item'a _top (birikimli / override) ve _left (override ?? defaultLeft) ekle
  const itemsWithPositions = computePositions(items, settings);

  // 3. DataSet / DataSource haritaları
  const allDataItems = items.filter((item) => item.type === "data");
  const dataSetMap = {};
  const dataSourceMap = {};
  allDataItems.forEach((item, index) => {
    dataSetMap[item.id] = `DataSet${index + 1}`;
    dataSourceMap[item.id] = `DataSource${index + 1}`;
  });

  // 4. RDL bileşenlerini oluştur (settings + _top + _left dahil)
  const reportItemsList = buildReportItems(
    itemsWithPositions,
    TOTAL_REPORT_WIDTH,
    TOTAL_REPORT_HEIGHT,
    dataSetMap,
    settings,
  );

  // ÖNCE: reportItemsList dizisini (4. adımdan sonra) şu şekilde merge et:
  const reportItemsObj = {};
  reportItemsList.forEach((item) => {
    const [tagName, tagValue] = Object.entries(item)[0];
    if (reportItemsObj[tagName] !== undefined) {
      // Aynı tag zaten varsa array'e çevir
      if (!Array.isArray(reportItemsObj[tagName])) {
        reportItemsObj[tagName] = [reportItemsObj[tagName]];
      }
      reportItemsObj[tagName].push(tagValue);
    } else {
      reportItemsObj[tagName] = tagValue;
    }
  });

  // 5. DataSources & DataSets
  let allDataSources = [];
  let allDataSets = [];
  allDataItems.forEach((dataItem) => {
    const currentDataSetName = dataSetMap[dataItem.id];
    const currentDataSourceName = dataSourceMap[dataItem.id];
    const { DataSources, DataSets } = buildDataSection(
      dataItem,
      currentDataSetName,
      currentDataSourceName,
    );
    if (DataSources?.DataSource) allDataSources.push(DataSources.DataSource);
    if (DataSets?.DataSet) allDataSets.push(DataSets.DataSet);
  });

  // 6. XML objesi
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
            ReportItems: reportItemsObj,
            Height: `${TOTAL_REPORT_HEIGHT}pt`,
          },
          Width: `${TOTAL_REPORT_WIDTH}pt`,
          Page: {
            PageHeight: `${settings.pageHeight}pt`,
            PageWidth: `${settings.pageWidth}pt`,
            LeftMargin: `${settings.marginLeft}pt`,
            RightMargin: `${settings.marginRight}pt`,
            TopMargin: `${settings.marginTop}pt`,
            BottomMargin: `${settings.marginBottom}pt`,
            Style: { Border: { Style: "None" } },
          },
        },
      },
      AutoRefresh: "0",
      ...(allDataSources.length > 0 && {
        DataSources: { DataSource: allDataSources },
      }),
      ...(allDataSets.length > 0 && { DataSets: { DataSet: allDataSets } }),
      ReportParametersLayout: {
        GridLayoutDefinition: {
          NumberOfColumns: "4",
          NumberOfRows: "2",
        },
      },
      "rd:ReportUnitType": "Inch",
      "rd:PageUnit": "Px",
      "df:DefaultFontFamily": settings.fontFamily,
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: "@_",
    suppressEmptyNode: true,
  });

  const xmlOutput = builder.build(reportObj);
  return `<?xml version="1.0"?>\n${xmlOutput}`;
}

export { generateRDL };
