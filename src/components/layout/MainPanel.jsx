import { useEffect } from 'react';
import getMaxCharWidth from '../../utils/getMaxCharWidth';
import fixColumnNames from '../../utils/fixColumnNames';
import EmptyReport from '../report/EmptyReport';
import ReportHeader from '../report/ReportHeader';
import ReportItemRenderer from '../report/ReportItemRenderer';
import useReportStore from '../../store/useReportStore';



function MainPanel() {
    const {reportItems, updateItem, deleteItem} = useReportStore()
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
                <ReportHeader count={reportItems.length} />
                {reportItems.length === 0 ? (
                    <EmptyReport />
                ) : (
                    <div className="space-y-6">
                        {reportItems.map((item) => (
                            <div key={item.id}>
                                <ReportItemRenderer
                                    item={item}
                                    updateItem={updateItem}
                                    deleteItem={deleteItem}
                                    reportItems={reportItems}
                                    tableItem={tableItem}
                                    dataItem={dataItem}
                                    onUpdateTableColumnMapping={handleTableColumnMappingUpdate}
                                    onUpdateColumnName={handleUpdateColumnName}
                                    onDeleteColumn={handleDeleteColumn}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MainPanel;
