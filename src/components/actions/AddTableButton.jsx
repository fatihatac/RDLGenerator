import { Table} from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddTableButton({ onClick }) {


    return (<BaseAddItemButton
            onClick={onClick}
            icon={<Table size={20} />}
            iconColor="bg-green-100 text-green-600"
            bgColor="bg-gray-50"
            hoverBgColor="bg-green-50"
            hoverBorderColor="green-300"
            title="Tablo"
            description="Veri listelemek için"
        />)
}

export default AddTableButton;