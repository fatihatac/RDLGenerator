import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// useItemActions
// Her editor bileşeninin ortak ihtiyacı: updateItem + deleteItem.
// pushHistory çağrısı Undo/Redo desteği için eklendi.
// ---------------------------------------------------------------------------
export function useItemActions(itemId) {
  const { storeUpdateItem, storeDeleteItem, storePushHistory } = useReportStore(
    useShallow((state) => ({
      storeUpdateItem: state.updateItem,
      storeDeleteItem: state.deleteItem,
      storePushHistory: state.pushHistory,
    })),
  );

  const updateItem = useCallback(
    (updates) => {
      storePushHistory();
      storeUpdateItem(itemId, updates);
    },
    [itemId, storeUpdateItem, storePushHistory],
  );

  const deleteItem = useCallback(() => {
    storePushHistory();
    storeDeleteItem(itemId);
  }, [itemId, storeDeleteItem, storePushHistory]);

  return { updateItem, deleteItem };
}
