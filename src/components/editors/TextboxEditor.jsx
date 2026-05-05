import { FileText } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import PositionEditor from './PositionEditor';
import DeleteButton from '../ui/DeleteButton';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

function TextboxEditor({ item }) {
  const { updateItem, deleteItem } = useItemActions(item.id);
  const toast = useToast();
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  const handleDelete = () => {
    deleteItem();
    toast.info('Metin kutusu silindi.');
  };

  // Validate the input value
  const validateInput = (value) => {
    // Require at least 1 character and max 200 characters
    if (!value || value.trim() === '') {
      setIsValid(false);
      setValidationMessage('Bu alan boş bırakılamaz');
      return false;
    }
    
    if (value.length > 200) {
      setIsValid(false);
      setValidationMessage('Maksimum 200 karakter girilebilir');
      return false;
    }
    
    setIsValid(true);
    setValidationMessage('');
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const isValid = validateInput(value);
    if (isValid) {
      updateItem({ value });
    }
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
          onChange={handleChange}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-colors ${
            !isValid ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
          }`}
          placeholder="Örn: Satış Raporu 2025"
        />
        {!isValid && validationMessage && (
          <p className="text-xs text-red-500 mt-1">{validationMessage}</p>
        )}
      </div>
      <PositionEditor itemId={item.id} />
    </div>
  );
}

export default TextboxEditor;
