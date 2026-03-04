import { remove } from "lodash";
import { generateId, fixColumnNames } from "../../utils";
import { ITEM_TYPES } from "../../constants/appConstants";

// ---------------------------------------------------------------------------
// Helper — ITEM_TYPES.TABLE sabiti kullanılıyor, string literal yok
// ---------------------------------------------------------------------------
const findTable = (items, tableId) =>
  items.find((item) => item.id === tableId && item.type === ITEM_TYPES.TABLE);

// ---------------------------------------------------------------------------
// Slice — Immer (zustand/middleware/immer) ile yazıldı.
// Her action artık doğrudan draft üzerinde mutasyon yapıyor;
// cloneDeep kaldırıldı → performans ve okunabilirlik arttı.
// ---------------------------------------------------------------------------
export const createTableSlice = (set) => ({
  // ── Sütunlar ────────────────────────────────────────────────────────────

  addColumn: (tableId) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (!table) return;
      table.columns.push({
        id: generateId("column"),
        name: `Sütun ${table.columns.length + 1}`,
        mappedField: null,
      });
    }),

  removeColumn: (tableId, columnId) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (table) remove(table.columns, (c) => c.id === columnId);
    }),

  updateColumnName: (tableId, columnId, newName) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      const column = table?.columns.find((c) => c.id === columnId);
      if (column) column.name = newName;
    }),

  addRowNumberColumn: (tableId) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (!table) return;
      const alreadyExists = table.columns.some(
        (c) => c.mappedField === "RowNumber",
      );
      if (!alreadyExists) {
        table.columns.unshift({
          id: generateId("RowNumber"),
          name: "No",
          mappedField: "RowNumber",
          width: 30,
        });
      }
    }),

  reorderColumn: (tableId, startIndex, endIndex) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (!table?.columns) return;
      const [moved] = table.columns.splice(startIndex, 1);
      table.columns.splice(endIndex, 0, moved);
    }),

  updateColumnMappedField: (tableId, columnId, newMappedField) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      const column = table?.columns.find((c) => c.id === columnId);
      if (column) column.mappedField = newMappedField;
    }),

  // ── Gruplar ─────────────────────────────────────────────────────────────

  addGroup: (tableId) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (!table) return;
      if (!table.groups) table.groups = [];
      table.groups.push({
        id: generateId("group"),
        name: `Group${table.groups.length + 1}`,
        mappedField: null,
      });
    }),

  removeGroup: (tableId, groupId) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (table?.groups) remove(table.groups, (g) => g.id === groupId);
    }),

  updateGroupName: (tableId, groupId, newName) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      const group = table?.groups?.find((g) => g.id === groupId);
      if (group) group.name = newName;
    }),

  updateGroupMappedField: (tableId, groupId, newMappedField) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      const group = table?.groups?.find((g) => g.id === groupId);
      if (group) {
        group.mappedField = newMappedField;
        group.name = newMappedField
          ? fixColumnNames(newMappedField)
          : group.name;
      }
    }),

  // ── Toplamlar ───────────────────────────────────────────────────────────

  addSum: (tableId) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (!table) return;
      if (!table.sums) table.sums = [];
      table.sums.push({ id: generateId("sum"), mappedField: null });
    }),

  removeSum: (tableId, sumId) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      if (table?.sums) remove(table.sums, (s) => s.id === sumId);
    }),

  updateSumMappedField: (tableId, sumId, newMappedField) =>
    set((state) => {
      const table = findTable(state.reportItems, tableId);
      const sum = table?.sums?.find((s) => s.id === sumId);
      if (sum) sum.mappedField = newMappedField;
    }),
});
