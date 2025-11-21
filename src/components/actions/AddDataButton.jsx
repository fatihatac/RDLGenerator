import { FileBraces } from 'lucide-react';

function AddDataButton({ onClick }) {

    return (<button
        onClick={onClick}
        className="flex items-center p-3 bg-gray-50 hover:bg-yellow-50 hover:border-yellow-300 border border-gray-200 rounded-lg transition-all text-left group"
    >
        <div className="bg-yellow-100 text-yellow-600 p-2 rounded mr-3 group-hover:bg-yellow-200">
            <FileBraces size={20} />
        </div>
        <div>
            <span className="block font-medium text-gray-700">JSON Datasource</span>
            <span className="text-xs text-gray-500">Veri eklemek için</span>
        </div>
    </button>)
}

export default AddDataButton;