import { isObject, isArray, isNil, uniq, difference } from "lodash";
import { EXCLUDED_KEYS } from "../../constants/appConstants";

// Iterative key collection to prevent UI freeze and Stack Overflow on deep JSONs
function collectKeysIterative(data) {
  if (isNil(data)) {
    return [];
  }

  const extractedKeys = new Set();
  const processingStack = [data];

  while (processingStack.length > 0) {
    const currentElement = processingStack.pop();

    if (isArray(currentElement)) {
      for (let i = currentElement.length - 1; i >= 0; i--) {
        processingStack.push(currentElement[i]);
      }
    } else if (isObject(currentElement)) {
      for (const key in currentElement) {
        if (Object.prototype.hasOwnProperty.call(currentElement, key)) {
          const value = currentElement[key];

          if (!isObject(value)) {
            extractedKeys.add(key);
          }
          processingStack.push(value);
        }
      }
    }
  }

  return Array.from(extractedKeys);
}

const parseAndExtractJsonInfo = (jsonString) => {
  let parsedData = null;
  let processingError = null;

  if (!jsonString || jsonString.trim() === "") {
    return {
      parsedData: null,
      allKeys: [],
      filteredKeys: [],
      error: "JSON string is empty.",
    };
  }

  try {
    const trimmed = jsonString.trim();
    const normalizedString =
      trimmed.startsWith("[") && trimmed.endsWith("]")
        ? trimmed
        : `[${trimmed}]`;

    parsedData = JSON.parse(normalizedString);
  } catch (e) {
    processingError = "Invalid JSON string: " + e.message;
    console.error("JSON parse error:", e.message);
    return {
      parsedData: null,
      allKeys: [],
      filteredKeys: [],
      error: processingError,
    };
  }

  if (parsedData) {
    try {
      const allKeys = uniq(collectKeysIterative(parsedData));
      const filteredKeys = difference(allKeys, EXCLUDED_KEYS);

      return { parsedData, allKeys, filteredKeys, error: processingError };
    } catch (keyError) {
      processingError = "Error collecting keys from JSON: " + keyError.message;
      console.error(processingError);
      return {
        parsedData,
        allKeys: [],
        filteredKeys: [],
        error: processingError,
      };
    }
  }

  return {
    parsedData: null,
    allKeys: [],
    filteredKeys: [],
    error: "Unknown error.",
  };
};

export default parseAndExtractJsonInfo;
