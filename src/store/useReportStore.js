import { create } from "zustand";
import { createUISlice } from "./slices/uiSlice";
import { createReportSlice } from "./slices/reportSlice";
import { createTableSlice } from "./slices/tableSlice";

const useReportStore = create((set, get) => ({
  ...createUISlice(set, get),
  ...createReportSlice(set, get),
  ...createTableSlice(set, get),
}));

export default useReportStore;
