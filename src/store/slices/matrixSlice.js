import { generateId } from "../../utils";
import { ITEM_TYPES } from "../../constants/appConstants";

const findMatrix = (items, matrixId) =>
  items.find((item) => item.id === matrixId && item.type === ITEM_TYPES.MATRIX);

export const createMatrixSlice = (set) => ({
  addRowGroup: (matrixId) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      if (!matrix) return;
      if (!matrix.rowGroups) matrix.rowGroups = [];
      matrix.rowGroups.push({
        id: generateId("rowGroup"),
        name: `Row Group ${matrix.rowGroups.length + 1}`,
        mappedField: null,
        width: 72,
      });
    }),

  updateRowGroupName: (matrixId, groupId, newName) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      const group = matrix?.rowGroups?.find((g) => g.id === groupId);
      if (group) group.name = newName;
    }),

  updateRowGroupMappedField: (matrixId, groupId, newMappedField) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      const group = matrix?.rowGroups?.find((g) => g.id === groupId);
      if (group) {
        group.mappedField = newMappedField;
        if (newMappedField) group.name = newMappedField;
      }
    }),

  updateRowGroupWidth: (matrixId, groupId, newWidth) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      const group = matrix?.rowGroups?.find((g) => g.id === groupId);
      if (group) group.width = Number(newWidth);
    }),

  removeRowGroup: (matrixId, groupId) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      if (matrix?.rowGroups)
        matrix.rowGroups = matrix.rowGroups.filter((g) => g.id !== groupId);
    }),

  addColumnGroup: (matrixId) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      if (!matrix) return;
      if (!matrix.columnGroups) matrix.columnGroups = [];
      matrix.columnGroups.push({
        id: generateId("colGroup"),
        mappedField: null,
        width: 25,
        backgroundColor: "",
        valueExpr: "",
      });
    }),

  updateColumnGroupField: (matrixId, groupId, field, value) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      const group = matrix?.columnGroups?.find((g) => g.id === groupId);
      if (group) group[field] = value;
    }),

  removeColumnGroup: (matrixId, groupId) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      if (matrix?.columnGroups)
        matrix.columnGroups = matrix.columnGroups.filter((g) => g.id !== groupId);
    }),

  addStaticColumn: (matrixId) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      if (!matrix) return;
      if (!matrix.staticColumns) matrix.staticColumns = [];
      matrix.staticColumns.push({
        id: generateId("staticCol"),
        name: `Column ${matrix.staticColumns.length + 1}`,
        mappedField: null,
        width: 25,
      });
    }),

  updateStaticColumnField: (matrixId, colId, field, value) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      const col = matrix?.staticColumns?.find((c) => c.id === colId);
      if (col) col[field] = value;
    }),

  removeStaticColumn: (matrixId, colId) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      if (matrix?.staticColumns)
        matrix.staticColumns = matrix.staticColumns.filter((c) => c.id !== colId);
    }),

  updateMatrixDataSource: (matrixId, dataSourceId) =>
    set((state) => {
      const matrix = findMatrix(state.reportItems, matrixId);
      if (matrix) matrix.dataSourceId = dataSourceId;
    }),
});
