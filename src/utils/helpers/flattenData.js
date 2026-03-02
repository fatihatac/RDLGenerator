import { isArray, isObject, isNil, flatMap } from 'lodash';

function flattenData(data) {
  if (!isArray(data)) {
    return [];
  }

  const flatten = (items, parentData = {}) => {
    return flatMap(items, item => {
      const ownData = { ...parentData };
      let arrayChildren = [];

      for (const key in item) {
        const value = item[key];
        if (isArray(value)) {
          arrayChildren.push(...value);
        } else if (isObject(value) && !isNil(value)) {
          Object.assign(ownData, value);
        } else {
          ownData[key] = value;
        }
      }

      if (arrayChildren.length > 0) {
        return flatten(arrayChildren, ownData);
      } else {
        return ownData;
      }
    });
  };

  return flatten(data);
}

export { flattenData };
