import { COLUMN_NAME_MAP } from "../constants/ColumnNameMap";

function fixColumnNames(key) {
  if (!key) return "";
  console.log(key);
  
  const lowerKey = key.toLocaleLowerCase("tr-TR");
  if (COLUMN_NAME_MAP[lowerKey]) {
    return COLUMN_NAME_MAP[lowerKey];
  }
  console.log(lowerKey);
  let result = key.replace(/([A-Z])/g, ' $1')
  result = result.charAt(0).toUpperCase() + result.slice(1)
  console.log(result);
  return result.trim();
}

export default fixColumnNames;
