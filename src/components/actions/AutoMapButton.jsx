import { CheckSquare } from 'lucide-react';

const AutoMapButton = ({ onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-md flex items-center font-medium transition-all shadow-sm active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            title="Sütunları JSON alanlarıyla otomatik eşleştir"
        >
            <CheckSquare size={16} className="mr-2" />
            Otomatik Eşleştir
        </button>
    );
};

export default AutoMapButton;
