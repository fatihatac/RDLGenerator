import { FileBraces } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddDataButton({ onClick }) {
    return (
        <BaseAddItemButton
            onClick={onClick}
            icon={<FileBraces size={20} />}
            title="JSON Datasource"
            description="Veri eklemek için"
            className="bg-gray-50 hover:bg-yellow-50 hover:border-yellow-300"
            iconClassName="bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200"
        />
    );
}

export default AddDataButton;
