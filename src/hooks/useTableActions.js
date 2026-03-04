import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// useTableActions
// TableEditor için tablo-spesifik action'ları kapsüller.
// useItemActions'a tamamlayıcı olarak tasarlandı.
// ---------------------------------------------------------------------------
export function useTableActions(tableId) {
  const {
    storeAddColumn,
    storeAddRowNumberColumn,
    storeAddGroup,
    storeAddSum,
    storePushHistory,
  } = useReportStore(
    useShallow((state) => ({
      storeAddColumn:          state.addColumn,
      storeAddRowNumberColumn: state.addRowNumberColumn,
      storeAddGroup:           state.addGroup,
      storeAddSum:             state.addSum,
      storePushHistory:        state.pushHistory,
    })),
  );

  const addColumn = useCallback(() => {
    storePushHistory();
    storeAddColumn(tableId);
  }, [tableId, storeAddColumn, storePushHistory]);

  const addRowNumberColumn = useCallback(() => {
    storePushHistory();
    storeAddRowNumberColumn(tableId);
  }, [tableId, storeAddRowNumberColumn, storePushHistory]);

  const addGroup = useCallback(() => {
    storePushHistory();
    storeAddGroup(tableId);
  }, [tableId, storeAddGroup, storePushHistory]);

  const addSum = useCallback(() => {
    storePushHistory();
    storeAddSum(tableId);
  }, [tableId, storeAddSum, storePushHistory]);

  return { addColumn, addRowNumberColumn, addGroup, addSum };
}
