function convertTitleCase(str) {
  if (!str) {
    return "";
  }
  
  // Tüm metni küçük harfe çevirerek standart bir başlangıç yapın
  const lowerStr = str.toLocaleLowerCase('tr');

  // Metni boşluklara göre kelimelere ayırın
  const words = lowerStr.split(' ');

  const titleCasedWords = words.map(word => {
    if (word.length === 0) {
      return "";
    }
    
    // 1. Kelimenin ilk harfini Türkçe yerel ayarı ile BÜYÜK harfe çevir
    const firstChar = word.charAt(0).toLocaleUpperCase('tr');
    
    // 2. Kelimenin geri kalanını (ikinci harften sonrası) küçük harf olarak bırak
    const restOfWord = word.slice(1);
    
    // 3. İlk harf ve geri kalanı birleştir
    return firstChar + restOfWord;
  });

  // Kelimeleri tek bir dize halinde tekrar birleştirin
  return titleCasedWords.join(' ');
}

export default convertTitleCase;