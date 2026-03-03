import useReportStore from "../store/useReportStore";

export function useDataSource() {
  const dataItem = useReportStore((state) =>
    state.reportItems.find((item) => item.type === "data"),
  );

  return {
    dataItem,
    jsonKeys: dataItem?.jsonKeys || [],
    filteredJsonKeys: dataItem?.filteredJsonKeys || [],
  };
}
