import {
  calculateReportValues,
  computePositions,
} from "../../core/reportCalculations.js";
import buildDataSection from "../buildDataSection.js";
import { buildReportItems } from "../buildItems.js";
import { buildPageSection } from "../buildPageSection.js";
import useLayoutStore from "../../../store/useLayoutStore.js";
import { buildRDLXml } from "../rdlXmlBuilder";


function generatePDY00146(items) {
  const settings = useLayoutStore.getState().layoutSettings;

  const { TOTAL_REPORT_WIDTH, TOTAL_REPORT_HEIGHT } = calculateReportValues(
    items,
    settings,
  );

  // Content width: legend width (1062.75) dahil en geniş elemente göre
  const LEGEND_WIDTH = 1062.75;
  const ACTUAL_CONTENT_WIDTH = Math.max(TOTAL_REPORT_WIDTH, LEGEND_WIDTH);

  const itemsWithPositions = computePositions(items, settings);

  const bodyItems = itemsWithPositions.filter(
    (item) => !item.section || item.section === "body"
  );

  const allDataItems = items.filter((item) => item.type === "data");
  const dataSetMap = {};
  const dataSourceMap = {};
  allDataItems.forEach((item, index) => {
    dataSetMap[item.id] = `DataSet${index + 1}`;
    dataSourceMap[item.id] = `DataSource${index + 1}`;
  });

  const reportItemsList = buildReportItems(
    bodyItems,
    ACTUAL_CONTENT_WIDTH,
    TOTAL_REPORT_HEIGHT,
    dataSetMap,
    settings,
  );

  const reportItemsObj = {};
  reportItemsList.forEach((item) => {
    const [tagName, tagValue] = Object.entries(item)[0];
    if (reportItemsObj[tagName] !== undefined) {
      if (!Array.isArray(reportItemsObj[tagName])) {
        reportItemsObj[tagName] = [reportItemsObj[tagName]];
      }
      reportItemsObj[tagName].push(tagValue);
    } else {
      reportItemsObj[tagName] = tagValue;
    }
  });

  // Legend is handled by the pipeline (BUILDER_MAP → buildLegend via TEXTBOX item)

  let allDataSources = [];
  let allDataSets = [];
  allDataItems.forEach((dataItem) => {
    const currentDataSetName = dataSetMap[dataItem.id];
    const currentDataSourceName = dataSourceMap[dataItem.id];
    const dataSection = buildDataSection(
      dataItem,
      currentDataSetName,
      currentDataSourceName,
    );
    if (dataSection._isEmpty) return;
    if (dataSection.DataSources?.DataSource) allDataSources.push(dataSection.DataSources.DataSource);
    if (dataSection.DataSets?.DataSet) allDataSets.push(dataSection.DataSets.DataSet);
  });

  const pageConfig = {
    PageHeight: `${settings.pageHeight}pt`,
    PageWidth: `${ACTUAL_CONTENT_WIDTH + settings.marginLeft + settings.marginRight}pt`,
    LeftMargin: `${settings.marginLeft}pt`,
    RightMargin: `${settings.marginRight}pt`,
    TopMargin: `${settings.marginTop}pt`,
    BottomMargin: `${settings.marginBottom}pt`,
    Style: { Border: { Style: "None" } },
  };

  const pageHeader = buildPageSection(itemsWithPositions, "header", TOTAL_REPORT_WIDTH, settings);
  const pageFooter = buildPageSection(itemsWithPositions, "footer", TOTAL_REPORT_WIDTH, settings);
  if (pageHeader) pageConfig.PageHeader = pageHeader;
  if (pageFooter) pageConfig.PageFooter = pageFooter;

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
          Width: `${ACTUAL_CONTENT_WIDTH}pt`,
          Page: pageConfig,
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

   return buildRDLXml(reportObj);
}

export { generatePDY00146 };