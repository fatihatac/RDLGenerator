import { memo } from 'react';
import { TextboxEditor, TableEditor, JSONEditor, DateRangeEditor, ChartEditor } from '../editors';
import { ITEM_TYPES } from '../../constants/appConstants';

const EDITOR_MAP = {
  [ITEM_TYPES.TITLE]:      TextboxEditor,
  [ITEM_TYPES.TABLE]:      TableEditor,
  [ITEM_TYPES.DATA]:       JSONEditor,
  [ITEM_TYPES.DATE_RANGE]: DateRangeEditor,
  [ITEM_TYPES.CHART]:      ChartEditor,
};

// FIX: React.memo — yalnızca item prop'u değişince yeniden render edilir
function ReportItemRenderer({ item }) {
  const EditorComponent = EDITOR_MAP[item.type];

  if (!EditorComponent) {
    console.warn(`Bilinmeyen bileşen tipi: ${item.type}`);
    return null;
  }

  return <EditorComponent item={item} />;
}

export default memo(ReportItemRenderer);
