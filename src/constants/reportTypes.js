export const REPORT_TYPES = {
  STANDARD: "standard",
  ARAC_FORM: "arac_form",
  ACY000019: 'acy000019',
  MAV00001: "mav00001",
  PDY00146: 'pdy00146',
  PDY00107: 'pdy00107'
};  

export const REPORT_TYPE_OPTIONS = [
  {
    value: REPORT_TYPES.STANDARD,
    label: "Standart Rapor",
    description: "Tablo, grafik ve başlık bileşenleriyle özel rapor",
  },
  {
    value: REPORT_TYPES.PDY00146,
    label: "Puantaj Detay Raporu",
    description: "PDY00146",
  },
  {
    value: REPORT_TYPES.PDY00107,
    label: "Puantaj Kartı Raporu",
    description: "PDY00107",
  }
];