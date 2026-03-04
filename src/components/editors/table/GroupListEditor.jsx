import { X } from 'lucide-react';
import useReportStore from '../../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

export default function GroupListEditor({ tableId, groups, jsonKeys }) {
    const { updateGroupName, updateGroupMappedField, removeGroup } = useReportStore(
        useShallow((state) => ({
            updateGroupName: state.updateGroupName,
            updateGroupMappedField: state.updateGroupMappedField,
            removeGroup: state.removeGroup,
        }))
    );

    return (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Grup Tanımları</label>
            <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
                {(groups || []).length === 0 && <p className="text-xs text-gray-400 italic">Henüz grup eklenmedi.</p>}
                {(groups || []).map((group, idx) => (
                    <div key={group.id} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                        <input
                            type="text"
                            value={group.name}
                            onChange={(e) => updateGroupName(tableId, group.id, e.target.value)}
                            className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                            placeholder="Grup Adı (Örn: Bölüm)"
                        />
                        <select
                            value={group.mappedField || ''}
                            onChange={(e) => updateGroupMappedField(tableId, group.id, e.target.value || null)}
                            className="w-32 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                        >
                            <option value="">Alan Seçin</option>
                            {jsonKeys.map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                        <button onClick={() => removeGroup(tableId, group.id)} className="text-gray-400 hover:text-red-500">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}