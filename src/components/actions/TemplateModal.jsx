import { useState } from 'react';
import { X, Save, ArrowUpToLine, Trash2, BookTemplate } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

// ---------------------------------------------------------------------------
// TemplateModal
// Şablon kaydetme ve yükleme arayüzü.
// Header'daki "Şablonlar" butonuyla açılır.
// ---------------------------------------------------------------------------
export default function TemplateModal({ onClose }) {
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { templates, saveTemplate, loadTemplate, deleteTemplate } =
    useReportStore(
      useShallow((state) => ({
        templates: state.templates,
        saveTemplate: state.saveTemplate,
        loadTemplate: state.loadTemplate,
        deleteTemplate: state.deleteTemplate,
      })),
    );

  const handleSave = () => {
    if (!newName.trim()) return;
    saveTemplate(newName.trim());
    setNewName('');
  };

  const handleLoad = (id) => {
    loadTemplate(id);
    onClose();
  };

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteTemplate(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <BookTemplate size={18} className="text-blue-500" />
            Şablonlar
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Yeni şablon kaydet */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Mevcut Raporu Kaydet
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Şablon adı..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSave}
                disabled={!newName.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={15} />
                Kaydet
              </button>
            </div>
          </div>

          {/* Kayıtlı şablonlar */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Kayıtlı Şablonlar ({templates.length})
            </label>

            {templates.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                Henüz kayıtlı şablon yok.
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {templates.map((tpl) => (
                  <li
                    key={tpl.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{tpl.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(tpl.createdAt).toLocaleDateString('tr-TR', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                        {' · '}
                        {tpl.reportItems.length} bileşen
                      </p>
                    </div>

                    <button
                      onClick={() => handleLoad(tpl.id)}
                      title="Yükle"
                      className="text-blue-500 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50 transition-colors"
                    >
                      <ArrowUpToLine size={16} />

                    </button>

                    <button
                      onClick={() => handleDelete(tpl.id)}
                      title={confirmDelete === tpl.id ? 'Onaylamak için tekrar tıkla' : 'Sil'}
                      className={`p-1.5 rounded transition-colors ${confirmDelete === tpl.id
                        ? 'text-red-600 bg-red-50 animate-pulse'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
