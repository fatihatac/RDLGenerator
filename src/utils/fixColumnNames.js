import { COLUMN_NAME_MAP } from "../constants/ColumnNameMap";

function fixColumnNames(key) {
  if (!key) return "";

  const lowerKey = key.toLocaleLowerCase("tr-TR");
  if (COLUMN_NAME_MAP[lowerKey]) {
    return COLUMN_NAME_MAP[lowerKey];
  }
  let result = key.replace(/([A-Z])/g, ' $1')
  result = result.charAt(0).toUpperCase() + result.slice(1)

  return result.trim();
}

export default fixColumnNames;
