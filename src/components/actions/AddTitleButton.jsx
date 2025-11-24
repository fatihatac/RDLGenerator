import { FileText } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddTitleButton({ onClick }) {
    return (
        <BaseAddItemButton
            onClick={onClick}
            icon={<FileText size={20} />}
            title="Metin Kutusu"
            description="Başlık veya etiket için"
            className="bg-gray-50 hover:bg-blue-50 hover:border-blue-300"
            iconClassName="bg-blue-100 text-blue-600 group-hover:bg-blue-200"
        />
    );
}

export default AddTitleButton;
