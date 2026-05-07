import { ChevronDown } from 'lucide-react';

export function SectionHeader({ icon: SectionIcon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center shrink-0">
        <SectionIcon size={13} className="text-[#e12f27]" />
      </div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function FieldRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <label className="text-xs text-gray-600 shrink-0 w-36">{label}</label>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );
}

export function NumberInput({ value, onChange, min, max, step = 0.5, unit = 'pt' }) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-20 text-right text-xs px-2 py-1.5 rounded-md border border-gray-200 bg-white
                   focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
                   text-gray-800 [appearance:textfield]
                   [&::-webkit-outer-spin-button]:appearance-none
                   [&::-webkit-inner-spin-button]:appearance-none"
      />
      {unit && <span className="text-xs text-gray-400 w-4">{unit}</span>}
    </div>
  );
}

export function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none text-xs px-2.5 py-1.5 pr-7 rounded-md border border-gray-200 bg-white
                   focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400
                   text-gray-800 cursor-pointer min-w-[110px]"
      >
        {options.map((o) => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

export function AlignPicker({ value, onChange, options }) {
  return (
    <div className="flex rounded-md border border-gray-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`text-xs px-2.5 py-1.5 transition-colors ${value === opt
              ? 'bg-[#e12f27] text-white font-medium'
              : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Divider() {
  return <div className="border-t border-gray-100 my-4" />;
}
