import { Calendar } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import { useDataSource } from '../../hooks/useDataSource';
import DeleteButton from '../ui/DeleteButton';
import PositionEditor from './PositionEditor';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

function DateRangeEditor({ item }) {
  const { updateItem, deleteItem } = useItemActions(item.id);
  const { jsonKeys } = useDataSource();
  const toast = useToast();
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  const handleDelete = () => {
    deleteItem();
    toast.info('Tarih aralığı bileşeni silindi.');
  };

  // Validate the selected field
  const validateSelection = (value) => {
    // Require a field to be selected
    if (!value || value === '') {
      setIsValid(false);
      setValidationMessage('Lütfen bir veri alanı seçin');
      return false;
    }
    
    setIsValid(true);
    setValidationMessage('');
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const isValid = validateSelection(value);
    if (isValid) {
      updateItem({ mappedField: value });
    }
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
          onChange={handleChange}
          className={`w-full p-2 text-sm border rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-300 outline-none transition-colors ${
            !isValid ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:border-purple-400'
          }`}
        >
          <option value="">— Alan Seçin —</option>
          {jsonKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        {!isValid && validationMessage && (
          <p className="text-xs text-red-500 mt-1">{validationMessage}</p>
        )}
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
