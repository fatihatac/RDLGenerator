import { EXCLUDED_KEYS } from "../constants/appConstants";

// Recursively traverses an object or an array of objects to collect all unique keys.
function collectKeys(data, keys = new Set()) {
  if (Array.isArray(data)) {
    data.forEach(item => collectKeys(item, keys));
  } else if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      const value = data[key];
      // Only add keys that do not point to an object or array.
      if (typeof value !== 'object' || value === null) {
        keys.add(key);
      }
      // Always recurse to find nested keys.
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
      
      // Return the original parsed data and the collected keys
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

