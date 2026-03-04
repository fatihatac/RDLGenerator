import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createUISlice } from "./slices/uiSlice";
import { createReportSlice } from "./slices/reportSlice";
import { createTableSlice } from "./slices/tableSlice";
import { createHistorySlice } from "./slices/historySlice";
import { createTemplateSlice } from "./slices/templateSlice";

// ---------------------------------------------------------------------------
// NOT: Bu store Immer middleware kullanıyor.
// Kurmak için: npm install immer
// Immer, slice'lardaki doğrudan mutasyonları (state.x = y) güvenli hale
// getirir; cloneDeep'e gerek kalmaz.
// ---------------------------------------------------------------------------

const storeCreator = immer((set, get) => ({
  ...createUISlice(set, get),
  ...createReportSlice(set, get),
  ...createTableSlice(set, get),
  ...createHistorySlice(set, get),
  ...createTemplateSlice(set, get),
}));

const useReportStore = create(
  devtools(
    persist(storeCreator, {
      name: "rdl-report-designer",
      partialize: (state) => ({
        reportItems: state.reportItems,
        fileName: state.fileName,
        isPortrait: state.isPortrait,
        templates: state.templates,
      }),
    }),
    { name: "RDL Report Designer" },
  ),
);

export default useReportStore;
