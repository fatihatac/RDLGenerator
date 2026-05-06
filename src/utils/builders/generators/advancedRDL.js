// standartRDL.js ile aynı mimari: JS nesnesi → XMLBuilder → XML çıktısı.
// Template dosyaları sadece modül yüklenirken bir kez parse edilerek
// reportTemplates.js'te sabit JS nesnelerine dönüştürülür. Bu dosya
// o nesneleri alıp kullanıcı bileşenlerine (TITLE, DATA) göre günceller
// ve XMLBuilder ile RDL üretir.

import { XMLBuilder } from "fast-xml-parser";
import { ITEM_TYPES } from "../../../constants/appConstants";
import parseAndExtractJsonInfo from "../../core/parseAndExtractJsonInfo";
import { flattenData } from "../../helpers/flattenData";
import getDataType from "../../helpers/getDataType";
import format from 'xml-formatter'

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
  attributeNamePrefix: "@_",
  suppressEmptyNode: true,
});

// ReportParameter dizisinde name ile eşleşeni bulup DefaultValue'sunu güncelle
function setParamDefault(reportObj, paramName, value) {
  const section = reportObj?.Report?.ReportParameters?.ReportParameter;
  if (!section) return;
  const arr = Array.isArray(section) ? section : [section];
  const param = arr.find((p) => p?.["@_Name"] === paramName);
  if (param?.DefaultValue?.Values !== undefined) {
    param.DefaultValue.Values.Value = value;
  }
}

// DATA bileşeninin JSON'ından DataSource.ConnectString ve DataSet.Fields üret
function applyDataItem(report, dataItem) {
  const { parsedData, error } = parseAndExtractJsonInfo(dataItem.value);
  if (error || !parsedData?.length) return;

  const flattenedData = flattenData(parsedData);
  const firstRow = flattenedData[0] ?? {};

  // ConnectString güncelle
  const rawDS = report?.DataSources?.DataSource;
  const dataSource = Array.isArray(rawDS) ? rawDS[0] : rawDS;
  if (dataSource?.ConnectionProperties) {
    dataSource.ConnectionProperties.ConnectString = JSON.stringify({
      Data: JSON.stringify(flattenedData),
      DataMode: "inline",
      URL: "",
    });
  }

  // Fields section kullanıcının verisinden türet (tip uyumsuzluğunu önler)
  const rawDSet = report?.DataSets?.DataSet;
  const dataSet = Array.isArray(rawDSet) ? rawDSet[0] : rawDSet;
  if (dataSet) {
    dataSet.Fields = {
      Field: Object.keys(firstRow).map((key) => ({
        "@_Name": key,
        DataField: key,
        "rd:TypeName": getDataType(firstRow[key]),
      })),
    };
  }
}

// templateConfig: { parsed: <XMLParser çıktısı>, paramMappings: { title?: string, ... } }
export function generateAdvancedRDL(items, templateConfig) {
  try {
    const { parsed, paramMappings = {} } = templateConfig;

    // Paylaşılan sabit nesneyi klonla — her çağrıda temiz başlangıç
    const reportObj = JSON.parse(JSON.stringify(parsed));
    const report = reportObj.Report;

    // TITLE bileşeni → ilgili ReportParameter default değeri
    const titleItem = items.find(
      (i) => i.type === ITEM_TYPES.TITLE && i.value?.trim(),
    );
    if (titleItem && paramMappings.title) {
      setParamDefault(reportObj, paramMappings.title, titleItem.value);
    }

    // DATA bileşeni → ConnectString + Fields
    const dataItem = items.find(
      (i) => i.type === ITEM_TYPES.DATA && i.value?.trim(),
    );
    if (dataItem) {
      applyDataItem(report, dataItem);
    }

    const xmlOutput = xmlBuilder.build(reportObj);
    const advancedXml = `<?xml version="1.0" encoding="utf-8"?>\n${xmlOutput}`;

    try {
      const formattedXml = format(advancedXml, {
        indentation: '  ', // 2 spaces for each level
        collapseContent: true, // Keep short text nodes on a single line (e.g. <Height>15cm</Height>)
        lineSeparator: '\n', // Standard line breaks
        whiteSpaceAtEndOfSelfclosingTag: true // <Element /> instead of <Element/>
      });

      return formattedXml
    } catch (error) {
      console.error("Form RDL formatlama başarısız:", error);
      return formXml.replace(/^\s*[\r\n]/gm, '');
    }
  } catch (err) {
    console.error("Form RDL üretimi başarısız:", err);
    return null;
  }
}
