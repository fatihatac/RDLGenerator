import {  FileText} from 'lucide-react';


function AddTitleButton({ onClick }) {



    return (
        <button
            onClick={onClick}
            className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-lg transition-all text-left group"
        >
            <div className="bg-blue-100 text-blue-600 p-2 rounded mr-3 group-hover:bg-blue-200">
                <FileText size={20} />
            </div>
            <div>
                <span className="block font-medium text-gray-700">Metin Kutusu</span>
                <span className="text-xs text-gray-500">Başlık veya etiket için</span>
            </div>
        </button>
    )
}

export default AddTitleButton;