import { X } from 'lucide-react';
import useReportStore from '../../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

export default function ColumnGroupListEditor({ matrixId, columnGroups, jsonKeys }) {
  const { updateColumnGroupField, removeColumnGroup } = useReportStore(
    useShallow((state) => ({
      updateColumnGroupField: state.updateColumnGroupField,
      removeColumnGroup: state.removeColumnGroup,
    }))
  );

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Column Groups (Dynamic Columns)
      </label>
      <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
        {(columnGroups || []).length === 0 && (
          <p className="text-xs text-gray-400 italic">No column groups added yet.</p>
        )}
        {(columnGroups || []).map((group, idx) => (
          <div key={group.id} className="flex flex-col gap-1.5 p-2 bg-white rounded border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6 shrink-0">{idx + 1}.</span>
              <select
                value={group.mappedField || ''}
                onChange={(e) => updateColumnGroupField(matrixId, group.id, 'mappedField', e.target.value || null)}
                className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              >
                <option value="">Field</option>
                {jsonKeys.map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <input
                type="number"
                value={group.width || 25}
                onChange={(e) => updateColumnGroupField(matrixId, group.id, 'width', e.target.value)}
                className="w-16 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                placeholder="W"
                min={10}
              />
              <span className="text-[10px] text-gray-400">pt</span>
              <button onClick={() => removeColumnGroup(matrixId, group.id)} className="text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 pl-8">
              <input
                type="text"
                value={group.backgroundColor || ''}
                onChange={(e) => updateColumnGroupField(matrixId, group.id, 'backgroundColor', e.target.value)}
                className="flex-1 p-1.5 text-xs border border-gray-300 rounded focus:border-purple-500 outline-none font-mono"
                placeholder='Background expression (=Switch(Fields!Durum.Value="NC", "Transparent", ...))'
              />
            </div>
            <div className="flex items-center gap-2 pl-8">
              <input
                type="text"
                value={group.valueExpr || ''}
                onChange={(e) => updateColumnGroupField(matrixId, group.id, 'valueExpr', e.target.value)}
                className="flex-1 p-1.5 text-xs border border-gray-300 rounded focus:border-purple-500 outline-none font-mono"
                placeholder='Value expression (=Fields!Durum.Value)'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
