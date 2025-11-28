import { Trash2, FileText, Link } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import parseAndExtractJsonInfo from '../../utils/parseAndExtractJsonInfo';
import GenerateReportButton from '../actions/GenerateReportButton';

function JSONEditor({ item }) {
  const storeUpdateItem = useReportStore((state) => state.updateItem);
  const storeDeleteItem = useReportStore((state) => state.deleteItem);
  const storeUpdateColumnName = useReportStore((state) => state.updateColumnName);
  const storeRemoveColumn = useReportStore((state) => state.removeColumn);
  const storeUpdateColumnMappedField = useReportStore((state) => state.updateColumnMappedField);
  const triggerDataSideEffects = useReportStore((state) => state.triggerDataSideEffects);

  const tableItem = useReportStore((state) =>
    state.reportItems.find((reportItem) => reportItem.type === 'table')
  );

  const handleJsonChange = (e) => {
    const jsonString = e.target.value;
    const { allKeys, filteredKeys, error } = parseAndExtractJsonInfo(jsonString);

    if (error) {
      console.error("JSON parsing error in JSONEditor:", error);
    }
    
    storeUpdateItem(item.id, { 
      value: jsonString, 
      jsonKeys: allKeys, 
      filteredJsonKeys: filteredKeys 
    });
    console.log("burada oluştu");
    
  };

  const handleGenerateReport = () => {
    triggerDataSideEffects(item.id);
  };

  const showMappingUI =
    tableItem &&
    tableItem.columns.length > 0 &&
    item.jsonKeys &&
    item.jsonKeys.length > 0;

  const showGenerateButton = item.jsonKeys && item.jsonKeys.length > 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-yellow-600 font-semibold">
          <FileText size={18} className="mr-2" />
          <span>JSON Veri Kaynağı</span>
        </div>
        <button onClick={() => storeDeleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
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
          placeholder='Örn: [{ "isim": "Ahmet", "yas": 30 }]'
        />
        {item.jsonKeys && item.jsonKeys.length > 0 && (
          <div className="text-xs text-gray-500 pt-1">
            <span className="font-medium">Bulunan Alanlar:</span> {item.jsonKeys.join(', ')}
          </div>
        )}
      </div>

      {showGenerateButton && !showMappingUI && (
        <div className="mt-4 flex justify-center">
          <GenerateReportButton onClick={handleGenerateReport} />
        </div>
      )}

      {showMappingUI && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Link size={18} className="mr-2 text-blue-600" />
              Veri Eşleştirme
            </h3>
            {/* You could add a re-map button here if needed */}
          </div>
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
              col.mappedField !== "RowNumber" && (
              <div key={col.id} className="grid grid-cols-12 items-center gap-2">

                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => storeUpdateColumnName(tableItem.id, col.id, e.target.value)}
                  className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
                  placeholder="Rapor Sütun Adı"
                />

                <div className="col-span-1 text-center text-gray-400">
                  <Link size={14} />
                </div>

                <select
                  value={col.mappedField || ''}
                  onChange={(e) => storeUpdateColumnMappedField(tableItem.id, col.id, e.target.value)}
                  className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                  disabled={col.mappedField === "RowNumber"}
                >
                  <option value="">-- Eşleştir --</option>
                  {item.jsonKeys.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                <button
                  onClick={() => storeRemoveColumn(tableItem.id, col.id)}
                  className="col-span-1 text-gray-400 hover:text-red-500 justify-self-center"
                  title="Sütunu Sil"
                >
                  <Trash2 size={16} />
                </button>

              </div>)
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JSONEditor;