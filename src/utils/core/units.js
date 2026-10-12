// RDL'de piksel birimi yok (in, cm, mm, pt, pc). Arayüz px ile çalışır,
// hesaplar ve RDL çıktısı pt ile yapılır. 96 dpi: 1px = 0.75pt.
export const PX_TO_PT = 0.75;

const round2 = (n) => Math.round(n * 100) / 100;

export const pxToPt = (px) => round2(px * PX_TO_PT);
export const ptToPx = (pt) => round2(pt / PX_TO_PT);
