import { BarChart, Trash2 } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import parseAndExtractJsonInfo from '../../utils/parseAndExtractJsonInfo';


function ChartEditor({ item }) {
	const storeUpdateItem = useReportStore((state) => state.updateItem);
	const storeDeleteItem = useReportStore((state) => state.deleteItem);
	const reportItems = useReportStore((state) => state.reportItems);
	//const triggerDataSideEffects = useReportStore((state) => state.triggerDataSideEffects);

	// Use local state for the textarea value
	//const [jsonInput, setJsonInput] = useState(item.value || '');

	const dataItems = reportItems.filter((reportItem) => reportItem.type === 'data');
	console.log(dataItems);


	const handleJsonInputChange = (e) => {
		const jsonString = e.target.value;
		const { allKeys, filteredKeys, error } = parseAndExtractJsonInfo(jsonString);

		if (error) {
			console.error("JSON parsing error in ChartEditor:", error);
		}

		storeUpdateItem(item.id, {
			//dataSourceId: ,
			value: jsonString,
			jsonKeys: allKeys,
			filteredJsonKeys: filteredKeys
		});
	};

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

	//   // Then, trigger the side effects to generate the chart's data source and dataset
	//   triggerDataSideEffects(item.id);
	// };

	const hasJsonData = item.jsonKeys && item.jsonKeys.length > 0;

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

			{/* <select
				className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
			>
				<option value="">-- Eşleştir --</option>
				{dataItems.map((reportItem) => {
					if (reportItem.type === 'data' && reportItem.jsonKeys && reportItem.jsonKeys.length > 0) {
						return (
							<option key={reportItem.id} value={reportItem.id}>
								Veri Kaynağı ID: {reportItem.id}
							</option>
						);
					}
				})}

			</select> */}

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">JSON Verisi (Dizi formatında)</label>
				<textarea
					value={item.value}
					onChange={handleJsonInputChange}
					className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
					rows={5}
					placeholder='Örn: [{ "kategori": "A", "deger": 10 }, { "kategori": "B", "deger": 20 }]'
				/>
				{hasJsonData && (
					<div className="text-xs text-gray-500 pt-1">
						<span className="font-medium">Bulunan Alanlar:</span> {item.jsonKeys.join(', ')}
					</div>
				)}
			</div>
			{/*
      <div className="mt-4 flex justify-center">
        <GenerateReportButton
          onClick={() =>{console.log("chart eklendi")}}
          label="Grafik Verisini Oluştur & Eşleştir" // Override label for chart context
        />
      </div> */}
		</div>
	);
}

export default ChartEditor;