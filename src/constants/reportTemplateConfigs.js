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
        value: "W = Worked Days                O = OFF                       P = Paid Leave            UL = Unpaid Leave          S = Sick Leave                 PS = Paid Sick Leave                                V = Vacation        A = Absent                 FT = Free Time",
        valueTr: "W = Normal Mesai               O = Hafta Tatili            P = Ücretli Izin            UL=Ücretsiz Izin             S=SGK Raporlu Ucretsiz    PS = SGK Raporlu Ucretli (Vizite)             V = Yıllık İzin       A = Devamsızlık          FT = Denkleştirme Izni"
      },
    ],
  },
};
