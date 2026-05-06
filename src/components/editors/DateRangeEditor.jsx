import { Calendar } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import { useDataSource } from '../../hooks/useDataSource';
import DeleteButton from '../ui/DeleteButton';
import PositionEditor from './PositionEditor';
import { useToast } from '../../hooks/useToast';

function DateRangeEditor({ item }) {
  const { updateItem, deleteItem } = useItemActions(item.id);
  const { jsonKeys } = useDataSource();
  const toast = useToast();

  const handleDelete = () => {
    deleteItem();
    toast.info('Tarih aralığı bileşeni silindi.');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-purple-600 font-semibold">
          <Calendar size={18} />
          <span>Tarih Aralığı Göstergesi</span>
        </div>
        <DeleteButton onDelete={handleDelete} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Veri Alanı</label>
        <select
          value={item.mappedField || ''}
          onChange={(e) => updateItem({ mappedField: e.target.value })}
          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-300 outline-none transition-colors"
        >
          <option value="">— Alan Seçin —</option>
          {jsonKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        {jsonKeys.length === 0 && (
          <p className="text-xs text-gray-400 mt-1.5">
            Alan görmek için önce bir JSON veri kaynağı ekleyin.
          </p>
        )}
      </div>

      <PositionEditor itemId={item.id} />
    </div>
  );
}

export default DateRangeEditor;
