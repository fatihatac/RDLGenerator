import { Play } from 'lucide-react';

const GenerateReportButton = ({ onClick, disabled, label }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-md flex items-center font-medium transition-all shadow-sm active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            title="Rapor öğelerini oluşturur ve JSON alanlarıyla otomatik olarak eşleştirir"
        >
            <Play size={16} className="mr-2" />
            {label || "Raporu Oluştur & Eşleştir"}
        </button>
    );
};

export default GenerateReportButton;
