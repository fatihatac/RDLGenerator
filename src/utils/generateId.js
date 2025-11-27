let counters = {}

const generateId = (itemType = "")=>{
  if (!counters[itemType]) {
    counters[itemType] = 0
  }
  counters[itemType]++;
  const capitalizedItemType = itemType.charAt(0).toUpperCase() + itemType.slice(1);
  let id =  `${capitalizedItemType}${counters[itemType]}`;
  console.log(id);
  return id
}

export default generateId;
