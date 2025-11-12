import { Trash2, FileText } from 'lucide-react';

function JSONEditor({ item, updateItem, deleteItem }) {


    // console.log(item.value);
    // let parsedValue = JSON.parse(item.value);
    // const columns = parsedValue.length > 0 ? Object.keys(parsedValue[0]) : [];
    // console.log(columns);


    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-yellow-600 font-semibold">
                    <FileText size={18} className="mr-2" />
                    <span>JSON</span>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">JSON Nesnesi</label>
                <input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateItem(item.id, { value: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: { \'name\': \'John\', \'age\': 30 }"
                />
            </div>
        </div>
    );
};

export default JSONEditor;