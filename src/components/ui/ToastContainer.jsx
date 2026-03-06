import { useToastStore } from '../../hooks/useToast';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// ---------------------------------------------------------------------------
// Her toast tipinin renk + ikon tanımı
// ---------------------------------------------------------------------------
const TOAST_CONFIG = {
  success: {
    Icon: CheckCircle2,
    bar:  'bg-green-500',
    icon: 'text-green-500',
    bg:   'bg-white border-l-4 border-green-500',
    text: 'text-gray-800',
  },
  error: {
    Icon: AlertCircle,
    bar:  'bg-red-500',
    icon: 'text-red-500',
    bg:   'bg-white border-l-4 border-red-500',
    text: 'text-gray-800',
  },
  warning: {
    Icon: AlertTriangle,
    bar:  'bg-yellow-500',
    icon: 'text-yellow-500',
    bg:   'bg-white border-l-4 border-yellow-500',
    text: 'text-gray-800',
  },
  info: {
    Icon: Info,
    bar:  'bg-blue-500',
    icon: 'text-blue-500',
    bg:   'bg-white border-l-4 border-blue-500',
    text: 'text-gray-800',
  },
};

// ---------------------------------------------------------------------------
// Tek Toast bileşeni
// ---------------------------------------------------------------------------
function Toast({ toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
  const { Icon } = config;

  return (
    <div
      className={`
        flex items-start gap-3 w-80 rounded-lg shadow-lg px-4 py-3
        ${config.bg} ${config.text}
        animate-[slideIn_0.25s_ease-out]
      `}
      style={{ animation: 'slideIn 0.25s ease-out' }}
    >
      <Icon size={18} className={`${config.icon} shrink-0 mt-0.5`} />
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
      >
        <X size={15} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ToastContainer — App.jsx'e eklenecek, portal gibi davranır
// ---------------------------------------------------------------------------
export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (!toasts.length) return null;

  return (
    <>
      {/* Keyframe animasyonu — Tailwind'de tanımlı olmadığı için inline */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} />
          </div>
        ))}
      </div>
    </>
  );
}
