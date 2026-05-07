import { X } from 'lucide-react';
import useReportStore from '../../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

export default function RowGroupListEditor({ matrixId, rowGroups, jsonKeys }) {
  const { updateRowGroupName, updateRowGroupMappedField, updateRowGroupWidth, removeRowGroup } = useReportStore(
    useShallow((state) => ({
      updateRowGroupName: state.updateRowGroupName,
      updateRowGroupMappedField: state.updateRowGroupMappedField,
      updateRowGroupWidth: state.updateRowGroupWidth,
      removeRowGroup: state.removeRowGroup,
    }))
  );

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">Row Groups</label>
      <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
        {(rowGroups || []).length === 0 && (
          <p className="text-xs text-gray-400 italic">No row groups added yet.</p>
        )}
        {(rowGroups || []).map((group, idx) => (
          <div key={group.id} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-6 shrink-0">{idx + 1}.</span>
            <input
              type="text"
              value={group.name || ''}
              onChange={(e) => updateRowGroupName(matrixId, group.id, e.target.value)}
              className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              placeholder="Display name"
            />
            <select
              value={group.mappedField || ''}
              onChange={(e) => updateRowGroupMappedField(matrixId, group.id, e.target.value || null)}
              className="w-28 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
            >
              <option value="">Field</option>
              {jsonKeys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <input
              type="number"
              value={group.width || 72}
              onChange={(e) => updateRowGroupWidth(matrixId, group.id, e.target.value)}
              className="w-16 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              placeholder="W"
              min={10}
            />
            <span className="text-[10px] text-gray-400">pt</span>
            <button onClick={() => removeRowGroup(matrixId, group.id)} className="text-gray-400 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
