import { LayoutTemplate } from 'lucide-react';
import TextboxEditor from './TextboxEditor';
import TableEditor from './TableEditor';
import JSONEditor from './JSONEditor';
import DateRangeEditor from './DateRangeEditor';
import { useEffect } from 'react';
import getMaxCharWidth from '../utils/getMaxCharWidth';
import fixColumnNames from '../utils/fixColumnNames';
import useReportStore from '../store/useReportStore';

function MainPanel() {

    const { reportItems,updateItem, deleteItem } = useReportStore();

    const tableItem = reportItems.find(item => item.type === 'table');
    const dataItem = reportItems.find(item => item.type === 'data');

    useEffect(() => {
        if (dataItem && dataItem.value && tableItem && tableItem.columns.length > 0) {
            let parsedData = [];
            try {
                parsedData = JSON.parse(dataItem.value);
            } catch (e) {
                console.error("Genişlik hesaplanırken JSON parse edilemedi:", e);
                return; 
            }

            if (!Array.isArray(parsedData)) return;

            const updatedColumns = tableItem.columns.map(col => {
                const fixedName = fixColumnNames(col.mappedField);
                const newWidth = getMaxCharWidth(parsedData, col.mappedField, fixedName);
                
                if (col.width !== newWidth) {
                    return { ...col, width: newWidth };
                }
                return col;
            });

            const hasWidthChanged = updatedColumns.some((col, index) => col.width !== tableItem.columns[index].width);

            if (hasWidthChanged) {
                updateItem(tableItem.id, { columns: updatedColumns });
            }
        }
    }, [dataItem?.value, tableItem, updateItem, dataItem]);


    const handleTableColumnMappingUpdate = (columnId, newMappedField) => {
        if (!tableItem) return;

        const newCols = tableItem.columns.map(c =>
            c.id === columnId ? { ...c, mappedField: newMappedField } : c
        );

        updateItem(tableItem.id, { columns: newCols });
    };

    const handleUpdateColumnName = (columnId, newName) => {
        if (!tableItem) return;
        const newCols = tableItem.columns.map(c =>
            c.id === columnId ? { ...c, name: newName } : c
        );
        updateItem(tableItem.id, { columns: newCols });
    };

    const handleDeleteColumn = (columnId) => {
        if (!tableItem) return;
        const newCols = tableItem.columns.filter(c => c.id !== columnId);
        updateItem(tableItem.id, { columns: newCols });
    };

    return (
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Rapor Taslağı</h2>
                    <span className="text-sm text-gray-500">{reportItems.length} bileşen eklendi</span>
                </div>
                {reportItems.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50/50">
                        <LayoutTemplate size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">Raporunuz boş.</p>
                        <p className="text-gray-400 text-sm mt-1">Soldaki menüden bileşen ekleyerek başlayın.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reportItems.map((item) => (
                            <div key={item.id}>
                                {item.type === 'title' && (
                                    <TextboxEditor
                                        item={item}
                                        updateItem={updateItem}
                                        deleteItem={deleteItem}
                                    />
                                )}
                                {item.type === 'table' && (
                                    <TableEditor
                                        item={item}
                                        updateItem={updateItem}
                                        deleteItem={deleteItem}
                                        reportItems={reportItems}
                                    />
                                )}
                                {item.type === 'data' && (
                                    <JSONEditor
                                        item={item}
                                        updateItem={updateItem}
                                        deleteItem={deleteItem}
                                        tableItem={tableItem}
                                        onUpdateTableColumnMapping={handleTableColumnMappingUpdate}
                                        onUpdateColumnName={handleUpdateColumnName}
                                        onDeleteColumn={handleDeleteColumn}
                                    />
                                )}
                                {item.type === 'dateRange' && (
                                    <DateRangeEditor
                                        item={item}
                                        updateItem={updateItem}
                                        deleteItem={deleteItem}
                                        tableItem={tableItem}
                                        dataItem={dataItem}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MainPanel;