import { Trash2, Calendar } from 'lucide-react';
import useReportStore from '../store/reportStore';
import { shallow } from 'zustand/shallow';

function DateRangeEditor({ item }) {
  const { dataItem, updateItem, deleteItem } = useReportStore(state => ({
    dataItem: state.reportItems.find(i => i.type === 'data'),
    updateItem: state.updateItem,
    deleteItem: state.deleteItem,
  }), shallow);

  const availableFields = dataItem?.jsonKeys || [];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-purple-600 font-semibold">
          <Calendar size={18} className="mr-2" />
          <span>Tarih Aralığı Göstergesi</span>
        </div>
        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Veri Alanı</label>
          <select 
            value={item.mappedField || ''}
            onChange={(e) => updateItem(item.id, { mappedField: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-500 outline-none"
          >
            <option value="">-- Alan Seçin --</option>
            {availableFields.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      </div>
  );
};

export default DateRangeEditor;



















// import { Trash2, FileText } from 'lucide-react';

// function DateRangeEditor({ item, updateItem, deleteItem, dataItem, tableItem }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
//       <div className="flex justify-between items-center mb-2">
//         <div className="flex items-center text-blue-600 font-semibold">
//           <FileText size={18} className="mr-2" />
//           <span>Tarih Aralığı</span>
//         </div>
//         <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
//           <Trash2 size={18} />
//         </button>
//       </div>
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Görüntülenecek Metin</label>
//         <input
//           type="text"
//           value={item.value}
//           onChange={(e) => updateItem(item.id, { value: e.target.value })}
//           className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
//           placeholder="Örn: 2025-01-01 - 2025-12-31"
//         />
//       </div>
//     </div>
//   );
// };

// export default DateRangeEditor;