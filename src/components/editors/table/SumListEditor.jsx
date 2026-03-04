import { X } from 'lucide-react';
import useReportStore from '../../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

export default function SumListEditor({ tableId, sums, jsonKeys }) {
    const { updateSumMappedField, removeSum } = useReportStore(
        useShallow((state) => ({
            updateSumMappedField: state.updateSumMappedField,
            removeSum: state.removeSum,
        }))
    );

    return (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Toplam Tanımları</label>
            <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
                {(sums || []).length === 0 && <p className="text-xs text-gray-400 italic">Henüz toplam eklenmedi.</p>}
                {(sums || []).map((sum, idx) => (
                    <div key={sum.id} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                        <select
                            value={sum.mappedField || ''}
                            onChange={(e) => updateSumMappedField(tableId, sum.id, e.target.value || null)}
                            className="w-32 p-1.5 text-sm border border-gray-300 rounded focus:border-red-500 outline-none"
                        >
                            <option value="">Alan Seçin</option>
                            {jsonKeys.map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                        <button onClick={() => removeSum(tableId, sum.id)} className="text-gray-400 hover:text-red-500">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}