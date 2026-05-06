import { FileText } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import PositionEditor from './PositionEditor';
import DeleteButton from '../ui/DeleteButton';
import { useToast } from '../../hooks/useToast';

function TextboxEditor({ item }) {
  const { updateItem, deleteItem } = useItemActions(item.id);
  const toast = useToast();

  const handleDelete = () => {
    deleteItem();
    toast.info('Metin kutusu silindi.');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-blue-600 font-semibold">
          <FileText size={18} />
          <span>Rapor Başlığı / Metin</span>
        </div>
        <DeleteButton onDelete={handleDelete} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Görüntülenecek Metin</label>
        <input
          type="text"
          value={item.value}
          onChange={(e) => updateItem({ value: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-colors"
          placeholder="Örn: Satış Raporu 2025"
        />
      </div>
      <PositionEditor itemId={item.id} />
    </div>
  );
}

export default TextboxEditor;
