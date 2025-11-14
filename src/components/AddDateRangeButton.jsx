import { CalendarRange } from 'lucide-react';

function AddDateRangeButton({ onClick }) {

    return (<button
        onClick={onClick}
        className="flex items-center p-3 bg-gray-50 hover:bg-red-50 hover:border-red-300 border border-gray-200 rounded-lg transition-all text-left group"
    >
        <div className="bg-red-100 text-red-600 p-2 rounded mr-3 group-hover:bg-red-200">
            <CalendarRange size={20} />
        </div>
        <div>
            <span className="block font-medium text-gray-700">Tarih Aralığı</span>
            <span className="text-xs text-gray-500">Rapor tarih aralığı</span>
        </div>
    </button>)
}

export default AddDateRangeButton;