import { useState, useEffect, useRef } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

// ---------------------------------------------------------------------------
// DeleteButton
// İlk tıkta "Emin misin?" durumuna geçer (2 sn içinde 2. tık → sil).
// 2 saniye geçerse otomatik sıfırlanır.
// ---------------------------------------------------------------------------
export default function DeleteButton({ onDelete, size = 18, className = '' }) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef(null);

  // 2 sn sonra sıfırla
  useEffect(() => {
    if (armed) {
      timerRef.current = setTimeout(() => setArmed(false), 2000);
    }
    return () => clearTimeout(timerRef.current);
  }, [armed]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!armed) {
      setArmed(true);
    } else {
      clearTimeout(timerRef.current);
      setArmed(false);
      onDelete();
    }
  };

  return (
    <button
      onClick={handleClick}
      title={armed ? 'Onaylamak için tekrar tıkla' : 'Sil'}
      className={`
        flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium
        transition-all duration-200
        ${armed
          ? 'bg-red-100 text-red-600 hover:bg-red-200 scale-105'
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        }
        ${className}
      `}
    >
      {armed ? (
        <>
          <AlertTriangle size={size - 2} />
          <span>Emin misin?</span>
        </>
      ) : (
        <Trash2 size={size} />
      )}
    </button>
  );
}
