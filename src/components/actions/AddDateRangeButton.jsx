import { CalendarRange } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddDateRangeButton({ onClick }) {

    return (<BaseAddItemButton
            onClick={onClick}
            icon={<CalendarRange size={20} />}
            iconColor="bg-red-100 text-red-600"
            bgColor="bg-gray-50"
            hoverBgColor="bg-red-50"
            hoverBorderColor="red-300"
            title="Tarih Aralığı"
            description="Rapor tarih aralığı"
        />)
}

export default AddDateRangeButton;