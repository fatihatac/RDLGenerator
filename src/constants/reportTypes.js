export const REPORT_TYPES = {
  STANDARD: "standard",
  ARAC_FORM: "arac_form",
  ACY000019:'acy000019'
};

export const REPORT_TYPE_OPTIONS = [
  {
    value: REPORT_TYPES.STANDARD,
    label: "Standart Rapor",
    description: "Tablo, grafik ve başlık bileşenleriyle özel rapor",
  },
  {
    value: REPORT_TYPES.ARAC_FORM,
    label: "Araç Talep Formu",
    description: "Araç talep formu şablonu",
  },
  {
    value: REPORT_TYPES.ACY000019,
    label: "Mobil Giriş Çıkış Raporu",
    description: "Personel mobil giriş çıkış kayıtları",
  },
];