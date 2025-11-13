function convertTitleCase(str) {
  if (!str) {
    return "";
  }

  const lowerStr = str.toLocaleLowerCase("tr");

  const words = lowerStr.split(" ");

  const titleCasedWords = words.map((word) => {
    if (word.length === 0) {
      return "";
    }

    const firstChar = word.charAt(0).toLocaleUpperCase("tr");

    const restOfWord = word.slice(1);

    return firstChar + restOfWord;
  });

  return titleCasedWords.join(" ");
}

export default convertTitleCase;
