import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

export function useMatrixActions(matrixId) {
  const actions = useReportStore(
    useShallow((state) => ({
      addRowGroup: state.addRowGroup,
      addColumnGroup: state.addColumnGroup,
      addStaticColumn: state.addStaticColumn,
      pushHistory: state.pushHistory,
    })),
  );

  const addRowGroup = useCallback(() => {
    actions.pushHistory();
    actions.addRowGroup(matrixId);
  }, [matrixId, actions]);

  const addColumnGroup = useCallback(() => {
    actions.pushHistory();
    actions.addColumnGroup(matrixId);
  }, [matrixId, actions]);

  const addStaticColumn = useCallback(() => {
    actions.pushHistory();
    actions.addStaticColumn(matrixId);
  }, [matrixId, actions]);

  return { addRowGroup, addColumnGroup, addStaticColumn };
}
