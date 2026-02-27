import React, { useMemo } from 'react';
import useReportStore from '../../store/useReportStore';
import parseAndExtractJsonInfo from '../../utils/parseAndExtractJsonInfo';

function ReportPreview() {
    const { reportItems, isPortrait, setIsPortrait } = useReportStore();

    const titleItem = reportItems.find(item => item.type === 'title');
    const dateRangeItem = reportItems.find(item => item.type === 'dateRange');
    const tableItem = reportItems.find(item => item.type === 'table');
    const dataItem = reportItems.find(item => item.type === 'data');

    const parsedData = useMemo(() => {
        if (!dataItem?.value) return [];
        const { parsedData } = parseAndExtractJsonInfo(dataItem.value);
        return Array.isArray(parsedData) ? parsedData : [];
    }, [dataItem?.value]);

    const paperDimensions = isPortrait
        ? { width: '210mm', minHeight: '297mm' }
        : { width: '297mm', minHeight: '210mm' };

    return (
        <div className="bg-gray-200 p-8 flex flex-col items-center overflow-auto w-full">

            {/* Control Toolbar */}
            <div className="mb-6 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-300">
                <span className="text-sm font-medium text-gray-700 mr-4">
                    Sayfa Yönü:
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

            <div
                className="bg-white shadow-2xl transition-all duration-300 ease-in-out"
                style={{
                    ...paperDimensions,
                    padding: '20mm', // Standard margins
                    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
                }}
            >
                {/* 1. Title Area */}
                {titleItem && titleItem.value && (
                    <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
                        {titleItem.value}
                    </h1>
                )}

                {/* 2. Date Range Area */}
                {dateRangeItem && (
                    <div className="text-right text-sm text-gray-600 mb-6 italic">
                        Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}
                    </div>
                )}

                {/* 3. Table Area */}
                {tableItem && tableItem.columns && tableItem.columns.length > 0 && parsedData.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400 text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    {tableItem.columns.map((column) => (
                                        <th
                                            key={column.id}
                                            className="border border-gray-400 px-3 py-2 text-left font-bold text-gray-700"
                                        >
                                            {column.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.slice(0, 50).map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50">
                                        {tableItem.columns.map((column) => {
                                            let cellValue = '';

                                            if (column.mappedField === 'RowNumber') {
                                                cellValue = rowIndex + 1;
                                            } else if (column.mappedField && row[column.mappedField] !== undefined) {
                                                cellValue = row[column.mappedField];
                                            }

                                            return (
                                                <td
                                                    key={`${rowIndex}-${column.id}`}
                                                    className="border border-gray-400 px-3 py-1.5 text-gray-600"
                                                >
                                                    {cellValue}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {parsedData.length > 50 && (
                            <div className="text-center text-xs text-gray-400 mt-2">
                                * Önizleme performansı için sadece ilk 50 kayıt gösterilmektedir. RDL dosyasında tüm kayıtlar yer alacaktır.
                            </div>
                        )}
                    </div>
                )}

                {(!tableItem || tableItem.columns.length === 0 || parsedData.length === 0) && (
                    <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 text-gray-400">
                        Önizleme oluşturmak için veri kaynağı ve tablo sütunları ekleyin.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportPreview;