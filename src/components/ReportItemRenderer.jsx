import TextboxEditor from './TextboxEditor';
import TableEditor from './TableEditor';
import JSONEditor from './JSONEditor';
import DateRangeEditor from './DateRangeEditor';

function ReportItemRenderer({ 
    item, 
    updateItem, 
    deleteItem, 
    reportItems,
    // Data ve Tablo ilişki propsları
    tableItem,
    dataItem,
    // Handlerlar
    onUpdateTableColumnMapping,
    onUpdateColumnName,
    onDeleteColumn
}) {
    switch (item.type) {
        case 'title':
            return <TextboxEditor item={item} updateItem={updateItem} deleteItem={deleteItem} />;
        
        case 'table':
            return (
                <TableEditor 
                    item={item} 
                    updateItem={updateItem} 
                    deleteItem={deleteItem} 
                    reportItems={reportItems} 
                />
            );
        
        case 'data':
            return (
                <JSONEditor
                    item={item}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                    tableItem={tableItem}
                    onUpdateTableColumnMapping={onUpdateTableColumnMapping}
                    onUpdateColumnName={onUpdateColumnName}
                    onDeleteColumn={onDeleteColumn}
                />
            );
        
        case 'dateRange':
            return (
                <DateRangeEditor
                    item={item}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                    tableItem={tableItem}
                    dataItem={dataItem}
                />
            );
            
        default:
            return null;
    }
}

export default ReportItemRenderer