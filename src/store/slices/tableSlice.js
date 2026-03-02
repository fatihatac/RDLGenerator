import { cloneDeep, remove } from "lodash";
import { generateId, fixColumnNames } from "../../utils";

// Helper Function
const findTable = (items, tableId) =>
  items.find((item) => item.id === tableId && item.type === "table");

export const createTableSlice = (set, get) => ({
  addColumn: (tableId) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        const newCol = {
          id: generateId("column"),
          name: `Sütun ${table.columns.length + 1}`,
          mappedField: null,
        };
        table.columns.push(newCol);
      }
      return { reportItems: newReportItems };
    }),

  removeColumn: (tableId, columnId) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) remove(table.columns, (c) => c.id === columnId);
      return { reportItems: newReportItems };
    }),

  updateColumnName: (tableId, columnId, newName) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        const column = table.columns.find((c) => c.id === columnId);
        if (column) column.name = newName;
      }
      return { reportItems: newReportItems };
    }),

  addRowNumberColumn: (tableId) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && !table.columns.some((c) => c.mappedField === "RowNumber")) {
        const newCol = {
          id: generateId("RowNumber"),
          name: "No",
          mappedField: "RowNumber",
          width: 30,
        };
        table.columns.unshift(newCol);
      }
      return { reportItems: newReportItems };
    }),

  reorderColumn: (tableId, startIndex, endIndex) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.columns) {
        const [removedColumn] = table.columns.splice(startIndex, 1);
        table.columns.splice(endIndex, 0, removedColumn);
      }
      return { reportItems: newReportItems };
    }),

  updateColumnMappedField: (tableId, columnId, newMappedField) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        const column = table.columns.find((c) => c.id === columnId);
        if (column) column.mappedField = newMappedField;
      }
      return { reportItems: newReportItems };
    }),

  addGroup: (tableId) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        if (!table.groups) table.groups = [];
        const newGroup = {
          id: generateId("group"),
          name: `Group${table.groups.length + 1}`,
          mappedField: null,
        };
        table.groups.push(newGroup);
      }
      return { reportItems: newReportItems };
    }),

  removeGroup: (tableId, groupId) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.groups) remove(table.groups, (g) => g.id === groupId);
      return { reportItems: newReportItems };
    }),

  updateGroupName: (tableId, groupId, newName) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.groups) {
        const group = table.groups.find((g) => g.id === groupId);
        if (group) group.name = newName;
      }
      return { reportItems: newReportItems };
    }),

  updateGroupMappedField: (tableId, groupId, newMappedField) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.groups) {
        const group = table.groups.find((g) => g.id === groupId);
        if (group) {
          group.mappedField = newMappedField;
          group.name = newMappedField
            ? fixColumnNames(newMappedField)
            : group.name;
        }
      }
      return { reportItems: newReportItems };
    }),

  addSum: (tableId) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table) {
        if (!table.sums) table.sums = [];
        const newSum = { id: generateId("sum"), mappedField: null };
        table.sums.push(newSum);
      }
      return { reportItems: newReportItems };
    }),

  removeSum: (tableId, sumId) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.sums) remove(table.sums, (s) => s.id === sumId);
      return { reportItems: newReportItems };
    }),

  updateSumMappedField: (tableId, sumId, newMappedField) =>
    set((state) => {
      const newReportItems = cloneDeep(state.reportItems);
      const table = findTable(newReportItems, tableId);
      if (table && table.sums) {
        const sum = table.sums.find((s) => s.id === sumId);
        if (sum) sum.mappedField = newMappedField;
      }
      return { reportItems: newReportItems };
    }),
});
