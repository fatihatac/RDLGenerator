// ---------------------------------------------------------------------------
// historySlice.js
// Undo / Redo desteği.
// Store'daki reportItems her değiştiğinde snapshot alınır.
// Ctrl+Z → undo(), Ctrl+Y → redo() ile geri/ileri gezilir.
// ---------------------------------------------------------------------------

const MAX_HISTORY = 50; // Bellek tasarrufu için maksimum geçmiş adımı

export const createHistorySlice = (set, get) => ({
  _past: [],    // önceki state'ler (en son = dizinin sonu)
  _future: [],  // undo sonrası redo için tutulanlar

  // Dışarıdan çağrılır: bir action öncesi snapshot al
  pushHistory: () => {
    const { reportItems, _past } = get();
    const snapshot = JSON.parse(JSON.stringify(reportItems)); // derin kopya
    const newPast = [..._past, snapshot];

    set({
      _past: newPast.length > MAX_HISTORY
        ? newPast.slice(newPast.length - MAX_HISTORY)
        : newPast,
      _future: [], // yeni action gelince redo geçmişini temizle
    });
  },

  undo: () => {
    const { _past, _future, reportItems } = get();
    if (_past.length === 0) return;

    const previous = _past[_past.length - 1];
    const newPast = _past.slice(0, -1);

    set({
      reportItems: previous,
      _past: newPast,
      _future: [JSON.parse(JSON.stringify(reportItems)), ..._future],
    });
  },

  redo: () => {
    const { _past, _future, reportItems } = get();
    if (_future.length === 0) return;

    const next = _future[0];
    const newFuture = _future.slice(1);

    set({
      reportItems: next,
      _past: [..._past, JSON.parse(JSON.stringify(reportItems))],
      _future: newFuture,
    });
  },

  canUndo: () => get()._past.length > 0,
  canRedo: () => get()._future.length > 0,
});
