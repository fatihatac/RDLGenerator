import { create } from "zustand";
import { generateRDL } from "../utils/rdlGenerator";

const useReportStore = create((set, get) => ({
  reportItems: [],
  addItem: (type) => {
    console.log("addItem");
    
    let newItem;
    if (type === "title") {
      newItem = { id: Date.now(), type: "title", value: "" };
    } else if (type === "table") {
      newItem = { id: Date.now(), type: "table", columns: [] };
    } else if (type === "data") {
      newItem = { id: Date.now(), type: "data", value: "", jsonKeys: [] };
    } else if (type === "dateRange") {
      newItem = { id: Date.now(), type: "dateRange", mappedField: null };
    }

    if (newItem) {
      set((state) => ({ reportItems: [...state.reportItems, newItem] }));
    }
  },
  deleteItem: (id) => {
    console.log("deleteItem");
    const { reportItems } = get();
    const itemToDelete = reportItems.find((item) => item.id === id);

    let newReportItems = reportItems;
    if (itemToDelete?.type === "data") {
      newReportItems = reportItems.filter(
        (item) => item.id !== id && item.dataSourceId !== id
      );
    } else {
      newReportItems = reportItems.filter((item) => item.id !== id);
    }
    set({ reportItems: newReportItems });
  },
  updateItem:(id, updates) =>{
    console.log("update");
    
  },

  // updateItem: (id, updates) => {
  //   console.log("updateItem");
  //   set((state) => ({
  //     reportItems: state.reportItems.map((item) =>
  //       item.id === id ? { ...item, ...updates } : item
  //     ),
  //   }));
  // },

  fileName:'',
  setFileName: (newFileName) => set({fileName:newFileName}),


  downloadReport: (fileName) => {
    console.log("downloadReport");
    const {reportItems} = get()
    const titleItem = reportItems.find((item) => item.type === "title");
    const reportTitle = titleItem ? titleItem.value : "TaslakRapor";

    let reportName =
      fileName && fileName.trim() !== "" ? fileName.trim() : reportTitle;

    const rdlContent = generateRDL(reportItems);

    const blob = new Blob([rdlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${reportName.toUpperCase()}.rdl`;

    a.click();
  },
}));

export default useReportStore;
