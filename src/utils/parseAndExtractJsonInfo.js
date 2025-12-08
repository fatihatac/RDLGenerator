import { EXCLUDED_KEYS } from "../constants/appConstants";

function collectKeys(data, keys = new Set()) {
  if (Array.isArray(data)) {
    data.forEach(item => collectKeys(item, keys));
  } else if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (typeof value !== 'object' || value === null) {
        keys.add(key);
      }
      collectKeys(value, keys);
    });
  }
  return keys;
}

const parseAndExtractJsonInfo = (jsonString) => {
  let parsedData = null;
  let error = null;

  if (!jsonString || jsonString.trim() === "") {
    return { parsedData: null, allKeys: [], filteredKeys: [], error: "JSON string is empty." };
  }

  try {
    parsedData = JSON.parse(jsonString);
  } catch (e) {
    error = "Invalid JSON string: " + e.message;
    console.error("JSON parse error:", e.message);
    return { parsedData: null, allKeys: [], filteredKeys: [], error };
  }

  if (parsedData) {
    try {
      const allKeysSet = collectKeys(parsedData);
      const allKeysArray = [...allKeysSet];
      const filteredKeys = allKeysArray.filter(key => !EXCLUDED_KEYS.includes(key));
      
      return { parsedData, allKeys: allKeysArray, filteredKeys, error };

    } catch (keyError) {
      error = "Error collecting keys from JSON: " + keyError.message;
      console.error(error);
      return { parsedData, allKeys: [], filteredKeys: [], error };
    }
  }

  return { parsedData: null, allKeys: [], filteredKeys: [], error: "Unknown error." };
};

export default parseAndExtractJsonInfo;

