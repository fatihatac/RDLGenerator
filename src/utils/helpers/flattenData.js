import { isArray, isObject, isNil } from "lodash";

// Refactored to use an iterative approach instead of recursion to prevent Call Stack Overflow
function flattenData(data) {
  if (!isArray(data)) {
    return [];
  }

  const flattenedResult = [];
  // Stack stores objects to process: { currentItem, parentContext }
  const processingStack = data.map((item) => ({
    currentItem: item,
    parentContext: {},
  }));

  while (processingStack.length > 0) {
    const { currentItem, parentContext } = processingStack.pop();
    const mergedData = { ...parentContext };
    const childArrays = [];

    for (const key in currentItem) {
      if (Object.prototype.hasOwnProperty.call(currentItem, key)) {
        const value = currentItem[key];

        if (isArray(value)) {
          childArrays.push(...value);
        } else if (isObject(value) && !isNil(value)) {
          Object.assign(mergedData, value);
        } else {
          mergedData[key] = value;
        }
      }
    }

    if (childArrays.length > 0) {
      // Push children to stack to process them iteratively
      for (let i = childArrays.length - 1; i >= 0; i--) {
        processingStack.push({
          currentItem: childArrays[i],
          parentContext: mergedData,
        });
      }
    } else {
      flattenedResult.push(mergedData);
    }
  }

  return flattenedResult;
}

export { flattenData };
