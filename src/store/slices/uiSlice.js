export const createUISlice = (set) => ({
  viewMode: "design",
  fileName: "",
  isPortrait: true,

  setIsPortrait: (portraitMode) => set({ isPortrait: portraitMode }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFileName: (newFileName) => set({ fileName: newFileName }),
});
