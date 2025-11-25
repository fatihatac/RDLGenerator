import { EXCLUDED_KEYS } from "../constants/appConstants";

const parseAndExtractJsonInfo = (jsonString) => {
  let parsedData = null;
  let allKeys = [];
  let filteredKeys = [];
  let error = null;

  if (!jsonString || jsonString.trim() === "") {
    return { parsedData: null, allKeys: [], filteredKeys: [], error: "JSON string is empty." };
  }

  try {
    parsedData = JSON.parse(jsonString);
  } catch (e1) {
    error = e1.message;
    console.error("JSON parse error:", e1.message);
    try {
      const cleanString = jsonString.replace(/[\n\r\t]/g, '');
      parsedData = JSON.parse(cleanString);
      error = null;
    } catch (e2) {
      error = "JSON could not be parsed even after cleanup: " + e2.message;
      console.error("JSON could not be parsed even after cleanup:", e2.message);
      return { parsedData: null, allKeys: [], filteredKeys: [], error: error };
    }
  }

  if (parsedData) {
    try {
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        allKeys = Object.keys(parsedData[0]);
      } else if (typeof parsedData === 'object' && parsedData !== null) {
        allKeys = Object.keys(parsedData);
      }
      filteredKeys = allKeys.filter(key => !EXCLUDED_KEYS.includes(key));
    } catch (keyError) {
      error = "Error extracting keys: " + keyError.message;
      console.error("Error extracting keys:", keyError);
      allKeys = [];
      filteredKeys = [];
    }
  }

  return { parsedData, allKeys, filteredKeys, error };
};

export default parseAndExtractJsonInfo;
