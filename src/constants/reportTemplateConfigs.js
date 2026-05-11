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
    ],
  },
};
