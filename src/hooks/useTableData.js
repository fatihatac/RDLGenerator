import { useMemo, useEffect } from "react";
import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { parseAndExtractJsonInfo, getMaxCharWidth } from "../utils";

export default function useTableData(tableItem) {
  // Global store'dan gerekli verileri ve fonksiyonları alıyoruz
  const { reportItems, updateItem } = useReportStore(
    useShallow((state) => ({
      reportItems: state.reportItems,
      updateItem: state.updateItem,
    })),
  );
  const dataItem = reportItems.find((i) => i.type === "data");
  const jsonKeys = dataItem?.filteredJsonKeys || [];

  // JSON verisini parse ediyoruz (Sadece veri değiştiğinde çalışır)
  const { parsedData } = useMemo(() => {
    if (!dataItem?.value) return { parsedData: null };
    return parseAndExtractJsonInfo(dataItem.value);
  }, [dataItem?.value]);

  // Sütun genişliklerini dinamik olarak hesaplıyoruz
  useEffect(() => {
    if (
      !parsedData ||
      !Array.isArray(parsedData) ||
      !tableItem?.columns?.length
    )
      return;

    const updatedColumns = tableItem.columns.map((col) => {
      if (col.mappedField === "RowNumber") return col;

      const newWidth = getMaxCharWidth(parsedData, col.mappedField, col.name);
      return col.width !== newWidth ? { ...col, width: newWidth } : col;
    });

    const hasWidthChanged = updatedColumns.some(
      (col, index) => col.width !== tableItem.columns[index].width,
    );

    if (hasWidthChanged) {
      updateItem(tableItem.id, { columns: updatedColumns });
    }
  }, [parsedData, tableItem, updateItem]);

  // UI bileşeninin ihtiyaç duyduğu temiz verileri döndürüyoruz
  return { parsedData, jsonKeys };
}
