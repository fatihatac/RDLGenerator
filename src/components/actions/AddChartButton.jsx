import { ChartArea } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';

function AddChartButton({ onClick }) {
    return (
        <BaseAddItemButton
            onClick={onClick}
            icon={<ChartArea size={20} />}
            title="Chart"
            description="Grafik eklemek için"
            className="bg-gray-50 hover:bg-neutral-50 hover:border-neutral-300"
            iconClassName="bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
        />
    );
}

export default AddChartButton;
