import { AlertTriangle, X } from 'lucide-react';

/**
 * Genel amaçlı onay modalı.
 * Props:
 *   title       — Modal başlığı
 *   description — Kullanıcıya gösterilecek açıklama (JSX kabul eder)
 *   confirmLabel — Onay butonu metni (varsayılan: "Evet")
 *   cancelLabel  — İptal butonu metni (varsayılan: "İptal")
 *   onConfirm   — Onaylandığında çağrılır
 *   onCancel    — İptal edildiğinde çağrılır
 */
function ConfirmModal({
  title        = 'Emin misiniz?',
  description,
  confirmLabel = 'Evet',
  cancelLabel  = 'İptal',
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <AlertTriangle size={18} className="text-orange-500" />
            {title}
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* İçerik */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 active:scale-95 transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
