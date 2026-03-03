import { VIEW_MODES } from "../../constants/appConstants";

export const createUISlice = (set) => ({
  viewMode: VIEW_MODES.DESIGN,
  fileName: "",
  isPortrait: true,

  setIsPortrait: (portraitMode) => set({ isPortrait: portraitMode }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFileName: (newFileName) => set({ fileName: newFileName }),
});
