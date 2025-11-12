import { Table} from 'lucide-react';


function AddTableButton({ onClick }) {


    return (<button
        onClick={onClick}
        className="flex items-center p-3 bg-gray-50 hover:bg-green-50 hover:border-green-300 border border-gray-200 rounded-lg transition-all text-left group"
    >
        <div className="bg-green-100 text-green-600 p-2 rounded mr-3 group-hover:bg-green-200">
            <Table size={20} />
        </div>
        <div>
            <span className="block font-medium text-gray-700">Tablo</span>
            <span className="text-xs text-gray-500">Veri listelemek için</span>
        </div>
    </button>)
}

export default AddTableButton;