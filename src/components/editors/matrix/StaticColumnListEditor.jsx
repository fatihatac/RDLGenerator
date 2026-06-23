import { X } from 'lucide-react';
import useReportStore from '../../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

export default function StaticColumnListEditor({ matrixId, staticColumns, jsonKeys }) {
  const { updateStaticColumnField, removeStaticColumn } = useReportStore(
    useShallow((state) => ({
      updateStaticColumnField: state.updateStaticColumnField,
      removeStaticColumn: state.removeStaticColumn,
    }))
  );

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">Static Columns (Summary)</label>
      <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
        {(staticColumns || []).length === 0 && (
          <p className="text-xs text-gray-400 italic">No static summary columns added yet.</p>
        )}
        {(staticColumns || []).map((col, idx) => (
          <div key={col.id} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-6 shrink-0">{idx + 1}.</span>
            <input
              type="text"
              value={col.name || ''}
              onChange={(e) => updateStaticColumnField(matrixId, col.id, 'name', e.target.value)}
              className="w-20 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              placeholder="Label"
            />
            <select
              value={col.mappedField || ''}
              onChange={(e) => updateStaticColumnField(matrixId, col.id, 'mappedField', e.target.value || null)}
              className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
            >
              <option value="">Field</option>
              {jsonKeys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <input
              type="number"
              value={col.width || 25}
              onChange={(e) => updateStaticColumnField(matrixId, col.id, 'width', e.target.value)}
              className="w-16 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              placeholder="W"
              min={10}
            />
            <span className="text-[10px] text-gray-400">pt</span>
            <input
              type="text"
              value={col.backgroundColorExpr || ''}
              onChange={(e) => updateStaticColumnField(matrixId, col.id, 'backgroundColorExpr', e.target.value)}
              className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              placeholder="Switch expr (optional)"
            />
            <button onClick={() => removeStaticColumn(matrixId, col.id)} className="text-gray-400 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
