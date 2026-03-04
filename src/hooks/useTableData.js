import { useMemo, useEffect, useRef } from "react";
import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { parseAndExtractJsonInfo, getMaxCharWidth } from "../utils";

export default function useTableData(tableItem) {
  const { reportItems, updateItem } = useReportStore(
    useShallow((state) => ({
      reportItems: state.reportItems,
      updateItem: state.updateItem,
    })),
  );

  const dataItem = reportItems.find((i) => i.type === "data");
  const jsonKeys = dataItem?.filteredJsonKeys || [];

  // JSON verisini parse ediyoruz — yalnızca ham değer değişince çalışır
  const { parsedData } = useMemo(() => {
    if (!dataItem?.value) return { parsedData: null };
    return parseAndExtractJsonInfo(dataItem.value);
  }, [dataItem?.value]);

  // FIX: Sonsuz döngüyü önlemek için tableItem nesnesinin tamamı yerine
  // stabil türetilmiş değerler dependency olarak kullanılıyor:
  //   - tableItem.id      → tablo değişince tetikle
  //   - columnIds (hash)  → sütun ekleme/silme değişince tetikle
  // Width hesabı sonucu bir ref ile karşılaştırılarak gereksiz updateItem
  // çağrısı engelleniyor.
  const tableId = tableItem?.id;
  const columnIds = tableItem?.columns?.map((c) => c.id).join(",") ?? "";

  // Son hesaplanan genişlikleri hatırlamak için ref kullanıyoruz
  const lastWidthsRef = useRef({});

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

    // Önceki hesaplamayla aynıysa updateItem çağırma
    const widthKey = updatedColumns.map((c) => `${c.id}:${c.width}`).join(",");
    if (lastWidthsRef.current[tableId] === widthKey) return;

    const hasWidthChanged = updatedColumns.some(
      (col, index) => col.width !== tableItem.columns[index].width,
    );

    if (hasWidthChanged) {
      lastWidthsRef.current[tableId] = widthKey;
      updateItem(tableItem.id, { columns: updatedColumns });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedData, tableId, columnIds]);

  return { parsedData, jsonKeys };
}
