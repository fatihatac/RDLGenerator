import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createUISlice } from "./slices/uiSlice";
import { createReportSlice } from "./slices/reportSlice";
import { createTableSlice } from "./slices/tableSlice";

const storeCreator = (set, get) => ({
  ...createUISlice(set, get),
  ...createReportSlice(set, get),
  ...createTableSlice(set, get),
});

const useReportStore = create(
  devtools(
    persist(storeCreator, {
      name: "rdl-report-designer",
      partialize: (state) => ({
        reportItems: state.reportItems,
        fileName: state.fileName,
        isPortrait: state.isPortrait,
      }),
    }),
    { name: "RDL Report Designer" },
  ),
);

export default useReportStore;
