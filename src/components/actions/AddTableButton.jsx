import { Table } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddTableButton({ onClick }) {
    return (
        <BaseAddItemButton
            onClick={onClick}
            icon={<Table size={20} />}
            title="Tablo"
            description="Veri listelemek için"
            className="bg-gray-50 hover:bg-green-50 hover:border-green-300"
            iconClassName="bg-green-100 text-green-600 group-hover:bg-green-200"
        />
    );
}

export default AddTableButton;
