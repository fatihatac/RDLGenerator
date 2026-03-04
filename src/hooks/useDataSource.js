import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { ITEM_TYPES } from "../constants/appConstants";

// ---------------------------------------------------------------------------
// useDataSource
// JSON datasource item'ına ve türetilmiş jsonKeys listesine erişim sağlar.
// DateRangeEditor, ChartEditor ve benzeri bileşenler bu hook'u kullanır.
// ---------------------------------------------------------------------------
export function useDataSource() {
  const reportItems = useReportStore(
    useShallow((state) => state.reportItems),
  );

  const dataItem = reportItems.find((i) => i.type === ITEM_TYPES.DATA);
  const jsonKeys = dataItem?.filteredJsonKeys || [];

  return { dataItem, jsonKeys };
}
