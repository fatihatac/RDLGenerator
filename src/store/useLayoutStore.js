import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ---------------------------------------------------------------------------
// Tüm rapor ölçülerinin default değerleri — tek kaynak
// Builder'lar ve SettingsPanel bu objeyi referans alır
// ---------------------------------------------------------------------------
export const DEFAULT_LAYOUT_SETTINGS = {
  // ── Sayfa boyutu & kenar boşlukları ──────────────────────────────────────
  pageWidth:    595.44,   // pt  (A4 portrait genişliği)
  pageHeight:   841.68,   // pt  (A4 portrait yüksekliği)
  marginLeft:   72,       // pt  (≈ 2.54 cm)
  marginRight:  72,       // pt
  marginTop:    72,       // pt
  marginBottom: 72,       // pt

  // ── Bileşen konumu ────────────────────────────────────────────────────────
  // Tüm bileşenler için varsayılan Left değeri (pt).
  // Her bileşen kendi leftOverride'ını set etmezse bu kullanılır.
  defaultLeft: 0,

  // Bileşenler arası dikey boşluk (pt) — Top birikimli hesabında eklenir
  itemSpacing:  5,        // pt

  // ── Yazı tipi ─────────────────────────────────────────────────────────────
  fontFamily:            'Segoe UI',
  titleFontSize:         10.5,   // pt
  titleFontWeight:       'Bold',
  columnHeaderFontSize:  10,     // pt
  columnDataFontSize:    7.5,    // pt

  // ── Boyutlar ──────────────────────────────────────────────────────────────
  titleHeight:   49.5,   // pt
  columnWidth:   72,     // pt  (varsayılan sütun genişliği)
  columnHeight:  18.6,   // pt  (her tablo satırı yüksekliği)
  chartHeight:   216,    // pt
  chartWidth:    288,    // pt

  // ── Hizalama ──────────────────────────────────────────────────────────────
  titleHAlign:  'Center',
  titleVAlign:  'Middle',
  columnHAlign: 'Left',
  columnVAlign: 'Middle',
};

const useLayoutStore = create(
  devtools(
    persist(
      immer((set) => ({
        layoutSettings: { ...DEFAULT_LAYOUT_SETTINGS },

        // Tek bir alanı güncelle
        updateLayoutSetting: (key, value) =>
          set((state) => {
            state.layoutSettings[key] = value;
          }),

        // Tüm ayarları varsayılana döndür
        resetLayoutSettings: () =>
          set((state) => {
            state.layoutSettings = { ...DEFAULT_LAYOUT_SETTINGS };
          }),
      })),
      { name: 'rdl-layout-settings' },
    ),
    { name: 'LayoutStore' },
  ),
);

export default useLayoutStore;
