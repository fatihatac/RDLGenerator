import { Trash2, FileText, Link, CheckSquare } from 'lucide-react';
import { EXCLUDED_KEYS } from '../constants/appConstants';

function JSONEditor({ item, updateItem, deleteItem, tableItem, onUpdateTableColumnMapping, onUpdateColumnName, onDeleteColumn }) {

  const handleJsonChange = (e) => {
    const jsonString = e.target.value;
    let keys = [];
    let filteredKeys = [];
    let parsedValue = null;

    try {
      parsedValue = JSON.parse(jsonString);
    } catch (e1) {
      console.error(e1.message);
      try {
        const cleanString = jsonString.replace(/[\n\r\t]/g, '');        
        parsedValue = JSON.parse(cleanString);

      } catch (e2) {
        console.error("JSON temizlendikten sonra bile parse edilemedi:", e2.message);
        keys = [];
      }
    }

    if (parsedValue) {
      try {
        if (Array.isArray(parsedValue) && parsedValue.length > 0) {
          keys = Object.keys(parsedValue[0]);
        }
        else if (typeof parsedValue === 'object' && parsedValue !== null && !Array.isArray(parsedValue)) {
          keys = Object.keys(parsedValue);
        }

        filteredKeys = keys.filter(key => !EXCLUDED_KEYS.includes(key));
      } catch (keyError) {
        console.error("Anahtar çıkarma hatası:", keyError);
        keys = [];
      }
    }


    updateItem(item.id, { value: jsonString, jsonKeys: keys, filteredJsonKeys: filteredKeys });
  };

  const showMappingUI =
    tableItem &&
    tableItem.columns.length > 0 &&
    item.jsonKeys &&
    item.jsonKeys.length > 0;


  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-yellow-600 font-semibold">
          <FileText size={18} className="mr-2" />
          <span>JSON Veri Kaynağı</span>
        </div>
        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">JSON Verisi (Dizi formatında)</label>
        <textarea
          value={item.value}
          onChange={handleJsonChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
          rows={5}
          placeholder="Örn: [{ &quot;isim&quot;: &quot;Ahmet&quot;, &quot;yas&quot;: 30 }]"
        />
        {item.jsonKeys && item.jsonKeys.length > 0 && (
          <div className="text-xs text-gray-500 pt-1">
            <span className="font-medium">Bulunan Alanlar:</span> {item.jsonKeys.join(', ')}
          </div>
        )}
      </div>

      {showMappingUI && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Link size={18} className="mr-2 text-blue-600" />
            Veri Eşleştirme
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Tablo sütunlarınız ile JSON veri alanlarınızı eşleştirin.
          </p>

          <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-3">

            <div className="grid grid-cols-12 items-center gap-2 mb-1 px-1">
              <label className="col-span-5 text-xs font-bold text-gray-500 uppercase">TABLO SÜTUNU</label>
              <div className="col-span-1"></div>
              <label className="col-span-5 text-xs font-bold text-gray-500 uppercase">JSON ALANI</label>
              <div className="col-span-1"></div>
            </div>
            {tableItem.columns.map((col) => (
              <div key={col.id} className="grid grid-cols-12 items-center gap-2">

                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => onUpdateColumnName(col.id, e.target.value)}
                  className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
                  placeholder="Rapor Sütun Adı"
                />

                <div className="col-span-1 text-center text-gray-400">
                  <Link size={14} />
                </div>

                <select
                  value={col.mappedField || ''}
                  onChange={(e) => onUpdateTableColumnMapping(col.id, e.target.value)}
                  className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                >
                  <option value="">-- Eşleştir --</option>
                  {item.jsonKeys.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                <button
                  onClick={() => onDeleteColumn(col.id)}
                  className="col-span-1 text-gray-400 hover:text-red-500 justify-self-center"
                  title="Sütunu Sil"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JSONEditor;