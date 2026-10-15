import useLayoutStore from '../store/useLayoutStore';
import { cssFontWeight } from '../utils/core/fontWeights';

// Önizleme bloklarının yazı stilleri; RDL'e yazılan ayarlarla aynı kaynak (pt).
export default function usePreviewFonts() {
  const s = useLayoutStore((st) => st.layoutSettings);
  return {
    title: { fontFamily: s.fontFamily, fontSize: `${s.titleFontSize}pt`, fontWeight: cssFontWeight(s.titleFontWeight, 'Bold') },
    header: { fontFamily: s.fontFamily, fontSize: `${s.columnHeaderFontSize}pt`, fontWeight: cssFontWeight(s.columnHeaderFontWeight, 'SemiBold') },
    cell: { fontFamily: s.fontFamily, fontSize: `${s.columnDataFontSize}pt`, fontWeight: cssFontWeight(s.columnDataFontWeight, 'Normal') },
  };
}
