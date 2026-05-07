import { useMemo, useEffect, useRef } from "react";
import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { parseAndExtractJsonInfo, getMaxCharWidth } from "../utils";

/**
 * useTableData — Parses JSON data and auto-calculates column widths.
 *
 * Width recalculation is triggered when:
 *   - parsedData changes (raw JSON value changed)
 *   - tableId changes (different table)
 *   - columnIds hash changes (columns added/removed)
 *
 * A ref cache prevents redundant store updates when widths haven't actually changed.
 */
export default function useTableData(tableItem) {
  const { reportItems, updateItem } = useReportStore(
    useShallow((state) => ({
      reportItems: state.reportItems,
      updateItem: state.updateItem,
    })),
  );

  const dataItem = reportItems.find((i) => i.type === "data");
  const jsonKeys = dataItem?.filteredJsonKeys || [];

  const { parsedData } = useMemo(() => {
    if (!dataItem?.value) return { parsedData: null };
    return parseAndExtractJsonInfo(dataItem.value);
  }, [dataItem?.value]);

  const tableId = tableItem?.id;
  const columnIds = tableItem?.columns?.map((c) => c.id).join(",") ?? "";

  const lastWidthsRef = useRef({});

  useEffect(() => {
    if (!parsedData || !Array.isArray(parsedData) || !tableItem?.columns?.length)
      return;

    const updatedColumns = tableItem.columns.map((col) => {
      if (col.mappedField === "RowNumber") return col;
      const newWidth = getMaxCharWidth(parsedData, col.mappedField, col.name);
      return col.width !== newWidth ? { ...col, width: newWidth } : col;
    });

    const widthKey = updatedColumns.map((c) => `${c.id}:${c.width}`).join(",");
    if (lastWidthsRef.current[tableId] === widthKey) return;

    const hasWidthChanged = updatedColumns.some(
      (col, index) => col.width !== tableItem.columns[index].width,
    );

    if (hasWidthChanged) {
      lastWidthsRef.current[tableId] = widthKey;
      updateItem(tableItem.id, { columns: updatedColumns });
    }
  }, [parsedData, tableId, columnIds, tableItem, updateItem]);

  return { parsedData, jsonKeys };
}
