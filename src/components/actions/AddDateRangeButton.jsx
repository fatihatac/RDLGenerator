import { CalendarRange } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddDateRangeButton({ onClick }) {
    return (
        <BaseAddItemButton
            onClick={onClick}
            icon={<CalendarRange size={20} />}
            title="Tarih Aralığı"
            description="Rapor tarih aralığı"
            className="bg-gray-50 hover:bg-red-50 hover:border-red-300"
            iconClassName="bg-red-100 text-red-600 group-hover:bg-red-200"
        />
    );
}

export default AddDateRangeButton;
