import { XMLParser } from "fast-xml-parser";
import { REPORT_TYPES } from "./reportTypes";
import { ITEM_TYPES } from "../constants/appConstants";
import { generateId } from "../utils";
import acy000019Xml from "../assets/ACY000019.xml?raw";
import aracFormXml from "../assets/ARACFORM.xml?raw";
import mav00001Xml from "../assets/MAV00001.xml?raw";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,   // sayısal değerleri string olarak koru (0pt, 1 vb.)
  trimValues: false,
  ignoreDeclaration: true, // <?xml ... ?> bildirimini atla, biz kendimiz ekleyeceğiz
});

// Yeni template rapor eklemek için:
// 1. XML dosyasını src/assets/ klasörüne ekle
// 2. Yukarıya ?raw import satırı ekle
// 3. Aşağıda REPORT_TEMPLATE_CONFIGS nesnesine ekle (parsed, paramMappings, getDefaultItems)
// 4. reportTypes.js'e yeni tipi ekle
export const REPORT_TEMPLATE_CONFIGS = {
  [REPORT_TYPES.ACY000019]: {
    parsed: parser.parse(acy000019Xml),
    // ITEM_TYPES → ReportParameter isim eşlemeleri
    // generateFormRDL bu mappingi kullanarak bileşen değerlerini
    // ilgili ReportParameter default değerine yazar
    paramMappings: {
      title: "ReportHeader", // TITLE bileşeni → ReportHeader param default'u
    },
    getDefaultItems: () => [
      {
        id: generateId("title"),
        type: ITEM_TYPES.TITLE,
        value: "Mobil Giriş Çıkış Raporu",
      },
      {
        id: generateId("datasource"),
        type: ITEM_TYPES.DATA,
        value: "",
        jsonKeys: [],
        filteredJsonKeys: [],
      },
    ],
  },
  [REPORT_TYPES.ARAC_FORM]: {
    parsed: parser.parse(aracFormXml),
    paramMappings: {},
    getDefaultItems: () => [
      {
        id: generateId("datasource"),
        type: ITEM_TYPES.DATA,
        value: "",
        jsonKeys: [],
        filteredJsonKeys: [],
      },
    ],
  },
  [REPORT_TYPES.MAV00001]: {
    parsed: parser.parse(mav00001Xml),
    paramMappings: {
      title: "ReportHeader", // TITLE bileşeni → ReportHeader param default'u
    },
    getDefaultItems: () => [
      {
        id: generateId("title"),
        type: ITEM_TYPES.TITLE,
        value: "Kritik Avans Raporu",
      },
      {
        id: generateId("datasource"),
        type: ITEM_TYPES.DATA,
        value: "",
        jsonKeys: [],
        filteredJsonKeys: [],
      },
    ],
  },
};
