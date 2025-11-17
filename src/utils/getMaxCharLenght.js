function getMaxCharLenght(data, key, headerText) {
  const MIN_WIDTH = 0; // Minimum genişlik (pt)
  const MAX_WIDTH = 150; // Maksimum genişlik (pt) - Çok uzun metinler sayfayı patlatmasın
  const CHAR_WIDTH_FACTOR = 5; // Ortalama bir karakterin genişliği (pt) (Trebuchet MS 10pt için yaklaşık)
  const PADDING = 0; // Hücre içi boşluklar için ekstra pay

  let maxLen = headerText ? headerText.length : 0;
  

  // Veri setindeki ilk 100 satırı kontrol et (Performans için hepsine bakmayabiliriz)
  const limit = Math.min(data.length, 100);
  let val = "";
  for (let i = 0; i < limit; i++) {
    val = data[i][key];
    console.log(data[i][key]);
    
    if (val !== null && val !== undefined) {
      const strVal = String(val);
      if (strVal.length > maxLen) {
        maxLen = strVal.length;
      }
    }
  }
  
  let calculatedWidth = maxLen * CHAR_WIDTH_FACTOR + PADDING;
  

  if (calculatedWidth < MIN_WIDTH) calculatedWidth = MIN_WIDTH;
  if (calculatedWidth > MAX_WIDTH) calculatedWidth = MAX_WIDTH;

  return Math.floor(calculatedWidth);
}

export default getMaxCharLenght;
