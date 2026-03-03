import { useItemActions } from '../../hooks/useItemActions';
import useReportStore from '../../store/useReportStore';

function ChartEditor({ item }) {
	const { updateItem, deleteItem } = useItemActions(item.id);

	const dataItems = useReportStore((state) =>
		state.reportItems.filter((i) => i.type === 'data' && i.jsonKeys?.length > 0)
	);

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
			<div className="flex justify-between items-center mb-2">
				<div className="flex items-center text-green-600 font-semibold">
					<BarChart size={18} className="mr-2" />
					<span>Grafik Veri Kaynağı</span>
				</div>
				<button onClick={deleteItem} className="text-red-400 hover:text-red-600 p-1">
					<Trash2 size={18} />
				</button>
			</div>

			<select
				value={item.dataSourceId || ''}
				onChange={(e) => updateItem({ dataSourceId: e.target.value })}
				className="w-full p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
			>
				<option value="">-- Veri Kaynağı Seçin --</option>
				{dataItems.map((dataItem) => (
					<option key={dataItem.id} value={dataItem.id}>
						Veri Kaynağı: {dataItem.id}
					</option>
				))}
			</select>
		</div>
	);
}

export default ChartEditor;