import { generateId } from "../utils";
import { ITEM_TYPES } from "./appConstants";
import { REPORT_TYPES } from "./reportTypes";

export const REPORT_TEMPLATE_CONFIGS = {
  [REPORT_TYPES.PDY00146]: {
    getDefaultItems: () => [
      {
        id: generateId("title"),
        type: ITEM_TYPES.TITLE,
        value: "Puantaj Detay Raporu",
      },
      {
        id: generateId("textbox"),
        type: ITEM_TYPES.TEXTBOX,
        isLegend: true,
        value: "W = Worked Days   O = OFF   P = Paid Leave   UL = Unpaid Leave   S = Sick Leave   PS = Paid Sick Leave   V = Vacation   A = Absent   FT = Free Time",
        valueTr: "W = Normal Mesai   O = Hafta Tatili   P = Ücretli İzin   UL = Ücretsiz İzin   S = SGK Raporlu Ücretsiz   PS = SGK Raporlu Ücretli (Vizite)   V = Yıllık İzin   A = Devamsızlık   FT = Denkleştirme İzni",
      },
      {
        id: generateId("data"),
        type: ITEM_TYPES.DATA,
        value: "",
        jsonKeys: [],
        filteredJsonKeys: [],
      },
      {
        id: generateId("matrix"),
        type: ITEM_TYPES.MATRIX,
        section: "body",
        dataSourceId: "Data1",
        rowGroups: [
          { id: generateId("rowGroup"), name: "SicilNo", mappedField: "sicilNo", width: 60 },
          { id: generateId("rowGroup"), name: "AdSoyad", mappedField: null, width: 100 },
        ],
        columnGroups: [
          { id: generateId("colGroup"), name: "Gun", mappedField: "gun", width: 20, backgroundColor: "", valueExpr: "" },
        ],
        staticColumns: [
          { id: generateId("staticCol"), name: "Durum", mappedField: "durum", width: 30, backgroundColorExpr: '=Switch(Fields!Durum.Value="NÇ","Transparent",Fields!Durum.Value="OFF","Green",Fields!Durum.Value="B","Orange",true,"Transparent")' },
          { id: generateId("staticCol"), name: "W", mappedField: "normalGunToplam", width: 20, backgroundColorExpr: '=Switch(Fields!Durum.Value="NÇ","Transparent",Fields!Durum.Value="OFF","Green",Fields!Durum.Value="B","Orange",true,"Transparent")' },
          { id: generateId("staticCol"), name: "O", mappedField: "haftaTatiliToplam", width: 20 },
          { id: generateId("staticCol"), name: "B", mappedField: "resmiTatilGunToplam", width: 20 },
          { id: generateId("staticCol"), name: "BW", mappedField: "resmiTatilCalismasiToplam", width: 20 },
          { id: generateId("staticCol"), name: "P", mappedField: "paidLeaveGunToplam", width: 20 },
          { id: generateId("staticCol"), name: "U", mappedField: "unpaidLeaveToplam", width: 20 },
          { id: generateId("staticCol"), name: "S", mappedField: "sickLeaveToplam", width: 20 },
          { id: generateId("staticCol"), name: "PS", mappedField: "paidSickLeaveToplam", width: 20 },
          { id: generateId("staticCol"), name: "V", mappedField: "vacationGunToplam", width: 20 },
          { id: generateId("staticCol"), name: "A", mappedField: "absentGunToplam", width: 20 },
          { id: generateId("staticCol"), name: "FT", mappedField: "freeTimeGunToplam", width: 20 },
          { id: generateId("staticCol"), name: "DAY", mappedField: "sGKGunToplam", width: 25 },
          { id: generateId("staticCol"), name: "İMZA", mappedField: null, width: 45, backgroundColorExpr: '=Switch(Fields!Durum.Value="NÇ","Transparent",Fields!Durum.Value="OFF","Green",Fields!Durum.Value="B","Orange",true,"Transparent")' },
        ],
      },
    ],
  },
};
