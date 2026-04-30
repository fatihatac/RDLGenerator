import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, BarChart2, FileText, LogIn } from 'lucide-react';
import { REPORT_TYPE_OPTIONS, REPORT_TYPES } from '../../constants/reportTypes';

const TYPE_ICONS = {
  [REPORT_TYPES.STANDARD]:  BarChart2,
  [REPORT_TYPES.ARAC_FORM]: FileText,
  [REPORT_TYPES.ACY000019]: LogIn,
};

function getIcon(value) {
  const Icon = TYPE_ICONS[value] ?? FileText;
  return Icon;
}

function ReportTypeSelector({ value, onChange }) {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState('');
  const containerRef        = useRef(null);
  const searchRef           = useRef(null);

  const selected = REPORT_TYPE_OPTIONS.find((o) => o.value === value);

  const filtered = REPORT_TYPE_OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()) ||
    o.description?.toLowerCase().includes(query.toLowerCase()),
  );

  // Dışarı tıkla → kapat
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Escape → kapat
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Açıldığında arama kutusuna odaklan
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setOpen(false);
    setQuery('');
  }

  const SelectedIcon = getIcon(value);

  return (
    <div ref={containerRef} className="relative">

      {/* ── Tetikleyici buton ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${open
            ? 'bg-white text-[#e12f27] shadow-sm'
            : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
      >
        <SelectedIcon size={15} />
        <span className="max-w-[160px] truncate">{selected?.label ?? 'Rapor Seç'}</span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Açılır panel ── */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          style={{ animation: 'dropIn 120ms ease-out' }}
        >

          {/* Başlık */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="w-1.5 h-4 rounded-full bg-[#e12f27]" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Rapor Tipi
            </span>
          </div>

          {/* Arama */}
          <div className="px-3 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 ring-1 ring-transparent focus-within:ring-[#e12f27]/30 focus-within:bg-white transition-all">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Rapor ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-300 hover:text-gray-500 transition-colors text-xs leading-none"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Seçenekler */}
          <div className="max-h-64 overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Search size={24} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Rapor bulunamadı</p>
              </div>
            ) : (
              filtered.map((option) => {
                const Icon = getIcon(option.value);
                const isActive = option.value === value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left group
                      ${isActive
                        ? 'bg-red-50'
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    {/* İkon */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                        ${isActive
                          ? 'bg-[#e12f27] text-white'
                          : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                        }`}
                    >
                      <Icon size={15} />
                    </div>

                    {/* Metin */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[#e12f27]' : 'text-gray-800'}`}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {option.description}
                        </p>
                      )}
                    </div>

                    {/* Seçili işareti */}
                    {isActive && (
                      <Check size={15} className="flex-shrink-0 text-[#e12f27]" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Alt bilgi */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {REPORT_TYPE_OPTIONS.length} rapor tipi mevcut
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}

export default ReportTypeSelector;
