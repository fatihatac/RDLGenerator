import useReportStore from "../store/useReportStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

export function useItemActions(itemId) {
  const { storeUpdateItem, storeDeleteItem } = useReportStore(
    useShallow((state) => ({
      storeUpdateItem: state.updateItem,
      storeDeleteItem: state.deleteItem,
    })),
  );

  const updateItem = useCallback(
    (updates) => storeUpdateItem(itemId, updates),
    [itemId, storeUpdateItem],
  );

  const deleteItem = useCallback(
    () => storeDeleteItem(itemId),
    [itemId, storeDeleteItem],
  );

  return { updateItem, deleteItem };
}
