import { XMLParser } from "fast-xml-parser";
import { REPORT_TYPES } from "./reportTypes";
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
// 3. Aşağıda REPORT_TEMPLATES nesnesine ekle (parsed + paramMappings)
// 4. reportTypes.js'e yeni tipi ekle
// 5. reportSlice.js → FORM_TYPE_DEFAULTS'a varsayılan bileşenleri ekle
export const REPORT_TEMPLATES = {
  [REPORT_TYPES.ACY000019]: {
    parsed: parser.parse(acy000019Xml),
    // ITEM_TYPES → ReportParameter isim eşlemeleri
    // generateFormRDL bu mappingi kullanarak bileşen değerlerini
    // ilgili ReportParameter default değerine yazar
    paramMappings: {
      title: "ReportHeader", // TITLE bileşeni → ReportHeader param default'u
    },
  },
  [REPORT_TYPES.ARAC_FORM]: {
    parsed: parser.parse(aracFormXml),
    paramMappings: {},
  },
  [REPORT_TYPES.MAV00001]: {
    parsed: parser.parse(mav00001Xml),
    paramMappings: {
      title: "ReportHeader", // TITLE bileşeni → ReportHeader param default'u
    },
  },
};
