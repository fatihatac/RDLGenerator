import { FileBraces } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddDataButton({ onClick }) {

    return (<BaseAddItemButton
            onClick={onClick}
            icon={<FileBraces size={20} />}
            iconColor="bg-blue-100 text-blue-600"
            bgColor="bg-gray-50"
            hoverBgColor="bg-blue-50"
            hoverBorderColor="blue-300"
            title="Metin Kutusu"
            description="Başlık veya etiket için"
        />)
}

export default AddDataButton;