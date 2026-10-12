// Test for position helpers in reportCalculations.js (no test framework)
// Run: node src/utils/core/__tests__/positions.test.js

import {
  computePositions,
  computeAlignedLeft,
  detectOverlaps,
  applyPageMargins,
} from '../reportCalculations.js';
import { pxToPt, ptToPx } from '../units.js';
import { DEFAULT_LAYOUT_SETTINGS } from '../../../store/useLayoutStore.js';

let passed = 0;
let failed = 0;
function assert(condition, message) {
  if (condition) { console.log(`  ✅ ${message}`); passed++; }
  else { console.log(`  ❌ ${message}`); failed++; }
}

const S = { ...DEFAULT_LAYOUT_SETTINGS, defaultLeft: 0, itemSpacing: 5 };
const table = (id, widths) => ({
  id, type: 'table', groups: [], sums: [],
  columns: widths.map((w, i) => ({ id: `${id}c${i}`, width: w })),
});

console.log('computePositions');
{
  const items = [{ id: 't', type: 'title' }, table('a', [100, 100])];
  const p = computePositions(items, S, 468);
  assert(p[0]._top === 0 && p[0]._left === 0, 'title starts at 0/0');
  assert(p[1]._top === S.titleHeight + S.itemSpacing, 'table Top accumulates');
  assert(p[0]._width === 468, 'title width = content width');
  assert(p[1]._width === 200, 'table width = sum of columns');
  const o = computePositions([{ ...items[0], topOverride: 30, leftOverride: 12 }], S, 468);
  assert(o[0]._top === 30 && o[0]._left === 12, 'overrides win');
}

console.log('computeAlignedLeft');
{
  const t = table('a', [100, 100]);
  assert(computeAlignedLeft(t, 'left', 468, S) === 0, 'left = 0');
  assert(computeAlignedLeft(t, 'center', 468, S) === 134, 'center = (468-200)/2');
  assert(computeAlignedLeft(t, 'right', 468, S) === 268, 'right = 468-200');
  assert(computeAlignedLeft(table('b', [600]), 'right', 468, S) === 0, 'wider than content clamps to 0');
}

console.log('detectOverlaps');
{
  const items = computePositions([table('a', [100]), table('b', [100])], S, 468);
  assert(Object.keys(detectOverlaps(items)).length === 0, 'stacked items do not overlap');
  const forced = computePositions(
    [table('a', [100]), { ...table('b', [100]), topOverride: 10 }], S, 468,
  );
  const ov = detectOverlaps(forced);
  assert(ov.a?.includes('b') && ov.b?.includes('a'), 'overridden Top overlaps');
  const side = computePositions(
    [table('a', [100]), { ...table('b', [100]), topOverride: 0, leftOverride: 150 }], S, 468,
  );
  assert(Object.keys(detectOverlaps(side)).length === 0, 'side by side does not overlap');
}

console.log('applyPageMargins');
{
  const base = computePositions([{ id: 't', type: 'title' }, { id: 'h', type: 'title', section: 'header' }], S, 468);
  const m = applyPageMargins(base, { ...S, marginLeft: 72, marginTop: 72 });
  assert(m[0]._left === 72 && m[0]._top === 72, 'body item shifted by margins');
  assert(m[1]._left === base[1]._left && m[1]._top === base[1]._top, 'header item untouched');
  assert(base[0]._left === 0, 'input not mutated');
}

console.log('px units & four-sided distances');
{
  assert(pxToPt(96) === 72 && ptToPx(72) === 96, '96px = 72pt');
  const t = table('a', [100, 100]); // 200pt wide, 2 rows
  const h = 2 * S.columnHeight;
  const left = computePositions([{ ...t, leftPx: 40, topPx: 20 }], S, 468)[0];
  assert(left._left === 30 && left._top === 15, 'Sol/Üst px → pt');
  const right = computePositions([{ ...t, rightPx: 40, bottomPx: 20 }], S, 468, 600)[0];
  assert(right._left === 468 - 200 - 30, 'Sağ: içerik − genişlik − sağ');
  assert(right._top === Math.round((600 - h - 15) * 100) / 100, 'Alt: içerik yüksekliği − yükseklik − alt');
  const both = computePositions([{ ...t, leftPx: 40, rightPx: 400 }], S, 468)[0];
  assert(both._left === 30, 'Sol, Sağ’dan öncelikli');
  const title = computePositions([{ id: 't', type: 'title', leftPx: 40, rightPx: 80 }], S, 468)[0];
  assert(title._left === 30 && title._width === 468 - 30 - 60, 'başlık: Sol+Sağ genişliği daraltır');
  const legacy = computePositions([{ ...t, leftOverride: 12, topOverride: 9 }], S, 468)[0];
  assert(legacy._left === 12 && legacy._top === 9, 'eski pt alanları hâlâ okunur');
}

console.log('per-item size & page-edge reference');
{
  const chart = { id: 'c', type: 'chart' };
  const c1 = computePositions([{ ...chart, widthPx: 200, heightPx: 100 }], S, 468)[0];
  assert(c1._width === 150 && c1._height === 75, 'grafik Genişlik/Yükseklik px → pt');
  const c2 = computePositions([{ ...chart }, { ...chart, id: 'c2', heightPx: 40 }], S, 468);
  assert(c2[0]._height === S.chartHeight && c2[1]._height === 30, 'her grafik kendi boyutunda');
  assert(c2[1]._top === S.chartHeight + S.itemSpacing, 'sonraki öğe gerçek yükseklikten sonra dizilir');

  const tb = computePositions([{ id: 'x', type: 'textbox', width: 120, height: 25 }], S, 468)[0];
  assert(tb._width === 120 && tb._height === 25, 'düz metin kutusu kendi boyutunu kullanır');
  const rc = computePositions([{ id: 'r', type: 'rectangle' }], S, 468)[0];
  assert(rc._width === 100 && rc._height === 100, 'dikdörtgen varsayılan 100x100');

  const t = { id: 'a', type: 'title', widthPx: 200, rightPx: 40 };
  const w = computePositions([t], S, 468)[0];
  assert(w._width === 150 && w._left === 468 - 150 - 30, 'başlık: Genişlik verilince Sağ çıpalar');

  const M = { ...S, marginLeft: 72, marginTop: 72, marginRight: 72, marginBottom: 72 };
  const pg = computePositions([{ ...chart, relativeTo: 'page', leftPx: 10, topPx: 10 }], M, 468)[0];
  assert(pg._left === 7.5 && pg._top === 7.5, 'kağıt kenarı: marjin eklenmez');
  assert(applyPageMargins([pg], M)[0]._left === 7.5, 'applyPageMargins kağıt-kenarı öğesine dokunmaz');
  const mg = computePositions([{ ...chart, leftPx: 10, topPx: 10 }], M, 468)[0];
  assert(applyPageMargins([mg], M)[0]._left === 7.5 + 72, 'marjin içi: marjin eklenir');
  const pr = computePositions([{ ...chart, relativeTo: 'page', widthPx: 100, rightPx: 0 }], M, 468)[0];
  assert(pr._left === 468 + 144 - 75, 'kağıt kenarı: Sağ=0 kağıdın sağ kenarına yaslar');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) throw new Error(`${failed} assertion(s) failed`);
