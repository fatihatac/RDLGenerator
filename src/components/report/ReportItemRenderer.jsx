import { TextboxEditor, TableEditor, JSONEditor, DateRangeEditor, ChartEditor } from '../editors';
import { ITEM_TYPES } from '../../constants/appConstants';

const EDITOR_MAP = {
    [ITEM_TYPES.TITLE]: TextboxEditor,
    [ITEM_TYPES.TABLE]: TableEditor,
    [ITEM_TYPES.DATA]: JSONEditor,
    [ITEM_TYPES.DATE_RANGE]: DateRangeEditor,
    [ITEM_TYPES.CHART]: ChartEditor,
};

function ReportItemRenderer({ item }) {
    const EditorComponent = EDITOR_MAP[item.type];

    if (!EditorComponent) {
        console.warn(`Unknown component type: ${item.type}`);
        return null;
    }

    return <EditorComponent item={item} />;
}

export default ReportItemRenderer;