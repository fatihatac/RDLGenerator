// import React, { useMemo } from 'react';
// import useReportStore from '../../store/useReportStore';
// import { useShallow } from 'zustand/react/shallow';
// import { parseAndExtractJsonInfo } from '../../utils';
// import { PAPER_DIMENSIONS, PAPER_STYLES } from '../../constants/layoutConstants';
// import { ITEM_TYPES } from '../../constants/appConstants';

// function ReportPreview() {
//     const { reportItems, isPortrait, setIsPortrait } = useReportStore(
//         useShallow((state) => ({
//             reportItems: state.reportItems,
//             isPortrait: state.isPortrait,
//             setIsPortrait: state.setIsPortrait,
//         }))
//     );

//     const titleItem = reportItems.find(item => item.type === ITEM_TYPES.TITLE);
//     const dateRangeItem = reportItems.find(item => item.type === ITEM_TYPES.DATE_RANGE);
//     const tableItem = reportItems.find(item => item.type === ITEM_TYPES.TABLE);
//     const dataItem = reportItems.find(item => item.type === ITEM_TYPES.DATA);

//     const parsedData = useMemo(() => {
//         if (!dataItem?.value) return [];
//         const { parsedData } = parseAndExtractJsonInfo(dataItem.value);
//         return Array.isArray(parsedData) ? parsedData : [];
//     }, [dataItem?.value]);

//     const currentLayout = isPortrait ? PAPER_DIMENSIONS.PORTRAIT : PAPER_DIMENSIONS.LANDSCAPE;

//     return (
//         <div className="flex flex-col items-center w-full">

//             {/* Araç Çubuğu (Toolbar) */}
//             <div className="mb-6 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-300 z-10">
//                 <span className="text-sm font-medium text-gray-700 mr-4">
//                     Kağıt Yönü:
//                 </span>
//                 <div className="flex bg-gray-100 p-1 rounded-md">
//                     <button
//                         onClick={() => setIsPortrait(true)}
//                         className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${isPortrait ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
//                             }`}
//                     >
//                         Dikey (Portrait)
//                     </button>
//                     <button
//                         onClick={() => setIsPortrait(false)}
//                         className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${!isPortrait ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
//                             }`}
//                     >
//                         Yatay (Landscape)
//                     </button>
//                 </div>
//             </div>

//             {/* A4 Kağıt Simülasyonu */}
//             <div
//                 className="bg-white shadow-2xl transition-all duration-300 ease-in-out relative flex flex-col overflow-hidden"
//                 style={{
//                     width: currentLayout.width,
//                     height: currentLayout.height,
//                     padding: PAPER_STYLES.padding,
//                     fontFamily: PAPER_STYLES.fontFamily
//                 }}
//             >
//                 {titleItem && titleItem.value && (
//                     <h1 className="text-2xl font-bold text-center mb-4 text-gray-800 shrink-0">
//                         {titleItem.value}
//                     </h1>
//                 )}

//                 {dateRangeItem && (
//                     <div className="text-right text-sm text-gray-600 mb-6 italic shrink-0">
//                         Rapor Tarih Aralığı: {new Date().toLocaleDateString('tr-TR')}
//                     </div>
//                 )}

//                 {/* Tablo Alanı */}
//                 {tableItem && tableItem.columns && tableItem.columns.length > 0 && parsedData.length > 0 && (
//                     <div className="w-full flex-1 overflow-hidden">
//                         <table className="w-full border-collapse border border-gray-400 text-sm table-fixed">
//                             <thead>
//                                 <tr className="bg-gray-100">
//                                     {tableItem.columns.map((column) => (
//                                         <th key={column.id} className="border border-gray-400 px-3 py-2 text-left font-bold text-gray-700 truncate">
//                                             {column.name}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {parsedData.slice(0, currentLayout.maxRows).map((row, rowIndex) => (
//                                     <tr key={rowIndex} className="hover:bg-gray-50">
//                                         {tableItem.columns.map((column) => {
//                                             let cellValue = '';
//                                             if (column.mappedField === 'RowNumber') {
//                                                 cellValue = rowIndex + 1;
//                                             } else if (column.mappedField && row[column.mappedField] !== undefined) {
//                                                 cellValue = row[column.mappedField];
//                                             }
//                                             return (
//                                                 <td key={`${rowIndex}-${column.id}`} className="border border-gray-400 px-3 py-1.5 text-gray-600 truncate">
//                                                     {cellValue}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {/* Uyarı Alanı */}
//                 {tableItem && parsedData.length > currentLayout.maxRows && (
//                     <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-400 shrink-0">
//                         * Önizleme performansı için tek sayfa ({currentLayout.maxRows} satır) ile sınırlandırılmıştır. İndireceğiniz RDL dosyası tüm verileri içerecektir.
//                     </div>
//                 )}

//                 {(!tableItem || tableItem.columns.length === 0 || parsedData.length === 0) && (
//                     <div className="flex items-center justify-center flex-1 border-2 border-dashed border-gray-300 text-gray-400">
//                         Önizleme oluşturmak için veri kaynağı ve sütun ekleyin.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ReportPreview;

import React, { useMemo } from 'react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { parseAndExtractJsonInfo } from '../../utils';
import { PAPER_DIMENSIONS, PAPER_STYLES } from '../../constants/layoutConstants';
import { ITEM_TYPES } from '../../constants/appConstants';
import { TableVirtuoso } from 'react-virtuoso';

function ReportPreview() {
    const { reportItems, isPortrait, setIsPortrait } = useReportStore(
        useShallow((state) => ({
            reportItems: state.reportItems,
            isPortrait: state.isPortrait,
            setIsPortrait: state.setIsPortrait,
        }))
    );

    const titleItem = reportItems.find(item => item.type === ITEM_TYPES.TITLE);
    const dateRangeItem = reportItems.find(item => item.type === ITEM_TYPES.DATE_RANGE);
    const tableItem = reportItems.find(item => item.type === ITEM_TYPES.TABLE);
    const dataItem = reportItems.find(item => item.type === ITEM_TYPES.DATA);

    const parsedData = useMemo(() => {
        if (!dataItem?.value) return [];
        const { parsedData } = parseAndExtractJsonInfo(dataItem.value);
        return Array.isArray(parsedData) ? parsedData : [];
    }, [dataItem?.value]);

    const currentLayout = isPortrait ? PAPER_DIMENSIONS.PORTRAIT : PAPER_DIMENSIONS.LANDSCAPE;

    return (
        <div className="flex flex-col items-center w-full">

            {/* Toolbar */}
            <div className="mb-6 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-300 z-10">
                <span className="text-sm font-medium text-gray-700 mr-4">
                    Kağıt Yönü:
                </span>
                <div className="flex bg-gray-100 p-1 rounded-md">
                    <button
                        onClick={() => setIsPortrait(true)}
                        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${isPortrait ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Dikey (Portrait)
                    </button>
                    <button
                        onClick={() => setIsPortrait(false)}
                        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${!isPortrait ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Yatay (Landscape)
                    </button>
                </div>
            </div>

            {/* A4 Paper Simulation */}
            <div
                className="bg-white shadow-2xl transition-all duration-300 ease-in-out relative flex flex-col overflow-hidden"
                style={{
                    width: currentLayout.width,
                    height: currentLayout.height,
                    padding: PAPER_STYLES.padding,
                    fontFamily: PAPER_STYLES.fontFamily
                }}
            >
                {titleItem && titleItem.value && (
                    <h1 className="text-2xl font-bold text-center mb-4 text-gray-800 shrink-0">
                        {titleItem.value}
                    </h1>
                )}

                {dateRangeItem && (
                    <div className="text-right text-sm text-gray-600 mb-6 italic shrink-0">
                        Rapor Tarih Aralığı: {new Date().toLocaleDateString('tr-TR')}
                    </div>
                )}

                {/* Virtualized Table Area */}
                {tableItem && tableItem.columns && tableItem.columns.length > 0 && parsedData.length > 0 && (
                    <div className="w-full flex-1 overflow-hidden">
                        <TableVirtuoso
                            style={{ height: '100%', width: '100%' }}
                            data={parsedData}
                            fixedHeaderContent={() => (
                                <tr className="bg-gray-100 shadow-sm">
                                    {tableItem.columns.map((column) => (
                                        <th key={column.id} className="border border-gray-400 px-3 py-2 text-left font-bold text-gray-700 truncate bg-gray-100">
                                            {column.name}
                                        </th>
                                    ))}
                                </tr>
                            )}
                            itemContent={(rowIndex, row) => (
                                <>
                                    {tableItem.columns.map((column) => {
                                        let cellValue = '';
                                        if (column.mappedField === 'RowNumber') {
                                            cellValue = rowIndex + 1;
                                        } else if (column.mappedField && row[column.mappedField] !== undefined) {
                                            cellValue = row[column.mappedField];
                                        }
                                        return (
                                            <td key={`${rowIndex}-${column.id}`} className="border border-gray-400 px-3 py-1.5 text-gray-600 truncate bg-white">
                                                {cellValue}
                                            </td>
                                        );
                                    })}
                                </>
                            )}
                            components={{
                                Table: (props) => <table {...props} className="w-full border-collapse border border-gray-400 text-sm table-fixed" />,
                                TableBody: React.forwardRef((props, ref) => <tbody {...props} ref={ref} />),
                                TableRow: (props) => <tr {...props} className="hover:bg-gray-50 border-b border-gray-100" />
                            }}
                        />
                    </div>
                )}

                {(!tableItem || tableItem.columns.length === 0 || parsedData.length === 0) && (
                    <div className="flex items-center justify-center flex-1 border-2 border-dashed border-gray-300 text-gray-400">
                        Önizleme oluşturmak için veri kaynağı ve sütun ekleyin.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportPreview;