// import { isObject, isArray, isNil, forEach, uniq, difference } from "lodash";
// import { EXCLUDED_KEYS } from "../../constants/appConstants";

// function collectKeys(data, keys = []) {
//   if (isNil(data)) {
//     return keys;
//   }

//   if (isArray(data)) {
//     forEach(data, (item) => collectKeys(item, keys));
//   } else if (isObject(data)) {
//     forEach(data, (value, key) => {
//       if (!isObject(value)) {
//         keys.push(key);
//       }
//       collectKeys(value, keys);
//     });
//   }
//   return keys;
// }

// const parseAndExtractJsonInfo = (jsonString) => {
//   let parsedData = null;
//   let error = null;

//   if (!jsonString || jsonString.trim() === "") {
//     return {
//       parsedData: null,
//       allKeys: [],
//       filteredKeys: [],
//       error: "JSON string is empty.",
//     };
//   }

//   try {
//     parsedData = JSON.parse(jsonString);
//   } catch (e) {
//     error = "Invalid JSON string: " + e.message;
//     console.error("JSON parse error:", e.message);
//     return { parsedData: null, allKeys: [], filteredKeys: [], error };
//   }

//   if (parsedData) {
//     try {
//       const allKeys = uniq(collectKeys(parsedData, []));
//       const filteredKeys = difference(allKeys, EXCLUDED_KEYS);

//       return { parsedData, allKeys, filteredKeys, error };
//     } catch (keyError) {
//       error = "Error collecting keys from JSON: " + keyError.message;
//       console.error(error);
//       return { parsedData, allKeys: [], filteredKeys: [], error };
//     }
//   }

//   return {
//     parsedData: null,
//     allKeys: [],
//     filteredKeys: [],
//     error: "Unknown error.",
//   };
// };

// export default parseAndExtractJsonInfo;

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
    parsedData = JSON.parse(jsonString);
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
