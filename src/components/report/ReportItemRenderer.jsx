// // import TextboxEditor from '../editors/TextboxEditor';
// // import TableEditor from '../editors/TableEditor';
// // import JSONEditor from '../editors/JSONEditor';
// // import DateRangeEditor from '../editors/DateRangeEditor';
// // import ChartEditor from '../editors/ChartEditor'; // New import

// // function ReportItemRenderer({ 
// //     item, 
// // }) {
// //     switch (item.type) {
// //         case 'title':
// //             return <TextboxEditor item={item} />;

// //         case 'table':
// //             return (
// //                 <TableEditor 
// //                     item={item} 
// //                 />
// //             );

// //         case 'data':
// //             return (
// //                 <JSONEditor
// //                     item={item}
// //                 />
// //             );

// //         case 'dateRange':
// //             return (
// //                 <DateRangeEditor
// //                     item={item}
// //                 />
// //             );

// //         case 'chart': 
// //             return (
// //                 <ChartEditor
// //                     item={item}
// //                 />
// //             );

// //         default:
// //             return null;
// //     }
// // }

// // export default ReportItemRenderer


// import TextboxEditor from '../editors/TextboxEditor';
// import TableEditor from '../editors/TableEditor';
// import JSONEditor from '../editors/JSONEditor';
// import DateRangeEditor from '../editors/DateRangeEditor';
// import ChartEditor from '../editors/ChartEditor';
// import { ITEM_TYPES } from '../../constants/appConstants';

// // Bileşen Haritası (Component Dictionary/Map)
// const EDITOR_MAP = {
//     [ITEM_TYPES.TITLE]: TextboxEditor,
//     [ITEM_TYPES.TABLE]: TableEditor,
//     [ITEM_TYPES.DATA]: JSONEditor,
//     [ITEM_TYPES.DATE_RANGE]: DateRangeEditor,
//     [ITEM_TYPES.CHART]: ChartEditor,
// };

// function ReportItemRenderer({ item }) {
//     const EditorComponent = EDITOR_MAP[item.type];

//     if (!EditorComponent) {
//         console.warn(`Unknown component type: ${item.type}`);
//         return null;
//     }

//     return <EditorComponent item={item} />;
// }

// export default ReportItemRenderer;

// src/components/report/ReportItemRenderer.jsx

// 5 satırlık import tek satıra düştü!
import { TextboxEditor, TableEditor, JSONEditor, DateRangeEditor, ChartEditor } from '../editors';
import { ITEM_TYPES } from '../../constants/appConstants';

// Bileşen Haritası (Component Dictionary/Map)
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