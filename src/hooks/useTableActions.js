import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

export function useTableActions(tableId) {
  const actions = useReportStore(
    useShallow((state) => ({
      addColumn: state.addColumn,
      addRowNumberColumn: state.addRowNumberColumn,
      addGroup: state.addGroup,
      addSum: state.addSum,
      pushHistory: state.pushHistory,
    })),
  );

  const addColumn = useCallback(() => {
    actions.pushHistory();
    actions.addColumn(tableId);
  }, [tableId, actions]);

  const addRowNumberColumn = useCallback(() => {
    actions.pushHistory();
    actions.addRowNumberColumn(tableId);
  }, [tableId, actions]);

  const addGroup = useCallback(() => {
    actions.pushHistory();
    actions.addGroup(tableId);
  }, [tableId, actions]);

  const addSum = useCallback(() => {
    actions.pushHistory();
    actions.addSum(tableId);
  }, [tableId, actions]);

  return { addColumn, addRowNumberColumn, addGroup, addSum };
}
