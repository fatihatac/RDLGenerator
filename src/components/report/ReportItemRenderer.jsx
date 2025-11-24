import TextboxEditor from '../editors/TextboxEditor';
import TableEditor from '../editors/TableEditor';
import JSONEditor from '../editors/JSONEditor';
import DateRangeEditor from '../editors/DateRangeEditor';

function ReportItemRenderer({ 
    item, 
}) {
    switch (item.type) {
        case 'title':
            return <TextboxEditor item={item} />;
        
        case 'table':
            return (
                <TableEditor 
                    item={item} 
                />
            );
        
        case 'data':
            return (
                <JSONEditor
                    item={item}
                />
            );
        
        case 'dateRange':
            return (
                <DateRangeEditor
                    item={item}
                />
            );
            
        default:
            return null;
    }
}

export default ReportItemRenderer