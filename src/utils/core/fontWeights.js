// RDL FontWeight yalnızca adlı değerleri kabul eder (sayısal "600" şemaya uymaz).
export const FONT_WEIGHT_OPTIONS = [
  { value: 'Light', label: 'İnce (Light)', css: 300 },
  { value: 'Normal', label: 'Normal', css: 400 },
  { value: 'Medium', label: 'Orta (Medium)', css: 500 },
  { value: 'SemiBold', label: 'Yarı kalın (SemiBold)', css: 600 },
  { value: 'Bold', label: 'Kalın (Bold)', css: 700 },
  { value: 'ExtraBold', label: 'Çok kalın (ExtraBold)', css: 800 },
];

const LEGACY = { 300: 'Light', 400: 'Normal', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', bold: 'Bold', normal: 'Normal' };

// Eski kayıtlı ayarlar ("600", "bold" vb.) geçerli RDL değerine çevrilir.
export function normalizeFontWeight(value, fallback = 'Normal') {
  if (value == null || value === '') return fallback;
  const known = FONT_WEIGHT_OPTIONS.find((o) => o.value === value);
  if (known) return known.value;
  return LEGACY[String(value).toLowerCase()] ?? fallback;
}

export const cssFontWeight = (value, fallback) =>
  FONT_WEIGHT_OPTIONS.find((o) => o.value === normalizeFontWeight(value, fallback))?.css ?? 400;
