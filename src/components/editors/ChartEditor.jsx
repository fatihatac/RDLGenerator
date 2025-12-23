import { BarChart, Trash2 } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
//import parseAndExtractJsonInfo from '../../utils/parseAndExtractJsonInfo';


function ChartEditor({ item }) {
	const storeUpdateItem = useReportStore((state) => state.updateItem);
	const storeDeleteItem = useReportStore((state) => state.deleteItem);
	const reportItems = useReportStore((state) => state.reportItems);
	//const triggerDataSideEffects = useReportStore((state) => state.triggerDataSideEffects);

	//const [jsonInput, setJsonInput] = useState(item.value || '');

	const dataItems = reportItems.filter((reportItem) => reportItem.type === 'data');


	// const handleJsonInputChange = (e) => {
	// 	const jsonString = e.target.value;
	// 	const { allKeys, filteredKeys, error } = parseAndExtractJsonInfo(jsonString);

	// 	if (error) {
	// 		console.error("JSON parsing error in ChartEditor:", error);
	// 	}

	// 	storeUpdateItem(item.id, {
	// 		//dataSourceId: ,
	// 		value: jsonString,
	// 		jsonKeys: allKeys,
	// 		filteredJsonKeys: filteredKeys
	// 	});
	// };

  function handleOnChange(e) {
    storeUpdateItem(item.id, { dataSourceId: e.target.value });
  }

	// const handleApplyChartData = () => {
	//   const { allKeys, filteredKeys, error } = parseAndExtractJsonInfo(jsonInput);

	//   if (error) {
	//       console.error("JSON parsing error in ChartEditor:", error);
	//       return;
	//   }

	//   storeUpdateItem(item.id, {
	//     value: jsonInput,
	//     jsonKeys: allKeys,
	//     filteredJsonKeys: filteredKeys
	//   });

	//   triggerDataSideEffects(item.id);
	// };

	//const hasJsonData = item.jsonKeys && item.jsonKeys.length > 0;

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
			<div className="flex justify-between items-center mb-2">
				<div className="flex items-center text-green-600 font-semibold">
					<BarChart size={18} className="mr-2" />
					<span>Grafik Veri Kaynağı</span>
				</div>
				<button onClick={() => storeDeleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
					<Trash2 size={18} />
				</button>
			</div>

			<select
        onChange={handleOnChange}
				className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
			>
				<option>-- Eşleştir --</option>
				{dataItems.map((reportItem) => {
					if (reportItem.type === 'data' && reportItem.jsonKeys && reportItem.jsonKeys.length > 0) {
						return (
							<option key={reportItem.id} value={reportItem.id}>
								Veri Kaynağı ID: {reportItem.id}
							</option>
						);
					}
				})}
			</select>
		</div>
	);
}

export default ChartEditor;