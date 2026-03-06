import { Trash2, FileText, Link } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { parseAndExtractJsonInfo } from '../../utils';
import GenerateReportButton from '../actions/GenerateReportButton';
import { useState } from 'react';
import Alert from '../ui/Alert';
import { processDataSideEffects } from '../../services/reportService';
import { useToast } from '../../hooks/useToast';
import DeleteButton from '../ui/DeleteButton';

const MAX_JSON_LENGTH = 100000;

function JSONEditor({ item }) {
  const {
    updateItem,
    deleteItem,
    updateColumnName,
    removeColumn,
    updateColumnMappedField,
    reportItems,
    setReportItems,
  } = useReportStore(
    useShallow((state) => ({
      updateItem: state.updateItem,
      deleteItem: state.deleteItem,
      updateColumnName: state.updateColumnName,
      removeColumn: state.removeColumn,
      updateColumnMappedField: state.updateColumnMappedField,
      reportItems: state.reportItems,
      setReportItems: state.setReportItems,
    }))
  );

  const toast = useToast();
  // YENİ: parse durumu — textarea border rengi için
  const [parseStatus, setParseStatus] = useState('idle'); // 'idle' | 'valid' | 'error'

  const tableItem = reportItems.find((i) => i.type === 'table');

  const handleJsonChange = (e) => {
    const jsonString = e.target.value;

    if (jsonString.length > MAX_JSON_LENGTH) {
      toast.error(`JSON verisi ${MAX_JSON_LENGTH} karakteri aşamaz.`);
      return;
    }

    if (!jsonString.trim()) {
      setParseStatus('idle');
      updateItem(item.id, { value: jsonString, jsonKeys: [], filteredJsonKeys: [] });
      return;
    }

    const { allKeys, filteredKeys, error } = parseAndExtractJsonInfo(jsonString);

    if (error) {
      setParseStatus('error');
    } else {
      setParseStatus('valid');
    }

    updateItem(item.id, {
      value: jsonString,
      jsonKeys: allKeys,
      filteredJsonKeys: filteredKeys,
    });
  };

  const handleGenerateReport = () => {
    processDataSideEffects(item.id, reportItems, setReportItems);
    toast.success('Rapor bileşenleri oluşturuldu.'); // YENİ
  };

  const handleDelete = () => {
    deleteItem(item.id);
    toast.info('Veri kaynağı silindi.'); // YENİ
  };

  const showMappingUI =
    tableItem &&
    tableItem.columns.length > 0 &&
    item.jsonKeys &&
    item.jsonKeys.length > 0;

  const showGenerateButton = item.jsonKeys && item.jsonKeys.length > 0;

  // YENİ: textarea border rengi parse durumuna göre
  const textareaBorderClass =
    parseStatus === 'error'
      ? 'border-red-400 focus:ring-red-300'
      : parseStatus === 'valid'
      ? 'border-green-400 focus:ring-green-300'
      : 'border-gray-300 focus:ring-blue-500';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-yellow-600 font-semibold">
          <FileText size={18} className="mr-2" />
          <span>JSON Veri Kaynağı</span>
          {/* YENİ: alan sayısı badge */}
          {parseStatus === 'valid' && item.jsonKeys?.length > 0 && (
            <span className="ml-2 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {item.jsonKeys.length} alan
            </span>
          )}
        </div>
        {/* YENİ: DeleteButton — orijinal Trash2 ikonunun yerini aldı */}
        <DeleteButton onDelete={handleDelete} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">JSON Verisi (Dizi formatında)</label>
        <textarea
          value={item.value}
          onChange={handleJsonChange}
          className={`w-full p-2 border rounded focus:ring-2 outline-none font-mono text-sm ${textareaBorderClass}`}
          rows={5}
          placeholder='Örn: [{ "isim": "Ahmet", "yas": 30 }]'
        />
        {/* YENİ: inline hata mesajı */}
        {parseStatus === 'error' && (
          <div className="mt-2">
            <Alert type="error" message="Geçersiz JSON formatı — lütfen veriyi kontrol edin." />
          </div>
        )}
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
            {tableItem.columns.map((col) =>
              col.mappedField !== "RowNumber" && (
                <div key={col.id} className="grid grid-cols-12 items-center gap-2">
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) => updateColumnName(tableItem.id, col.id, e.target.value)}
                    className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
                    placeholder="Rapor Sütun Adı"
                  />
                  <div className="col-span-1 text-center text-gray-400">
                    <Link size={14} />
                  </div>
                  <select
                    value={col.mappedField || ''}
                    onChange={(e) => updateColumnMappedField(tableItem.id, col.id, e.target.value)}
                    className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                    disabled={col.mappedField === "RowNumber"}
                  >
                    <option value="">-- Eşleştir --</option>
                    {item.jsonKeys.map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeColumn(tableItem.id, col.id)}
                    className="col-span-1 text-gray-400 hover:text-red-500 justify-self-center"
                    title="Sütunu Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JSONEditor;
