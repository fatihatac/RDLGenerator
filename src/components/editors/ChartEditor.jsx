import { BarChart2 } from 'lucide-react';
import { useItemActions } from '../../hooks/useItemActions';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/shallow';
import DeleteButton from '../ui/DeleteButton';
import PositionEditor from './PositionEditor';
import { useToast } from '../../hooks/useToast';

function ChartEditor({ item }) {
  const { updateItem, deleteItem } = useItemActions(item.id);
  const toast = useToast();

  const dataItems = useReportStore(
    useShallow((state) =>
      state.reportItems.filter((i) => i.type === 'data' && i.jsonKeys?.length > 0)
    )
  );

  // Get selected data item for field lists
  const selectedDataItem = dataItems.find(
    (dataItem) => dataItem.id === item.dataSourceId
  );

  const handleDelete = () => {
    deleteItem();
    toast.info('Grafik bileşeni silindi.');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-pink-600 font-semibold">
          <BarChart2 size={18} />
          <span>Grafik</span>
        </div>
        <DeleteButton onDelete={handleDelete} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Veri Kaynağı</label>
        <select
          value={item.dataSourceId || ''}
          onChange={(e) => updateItem({ dataSourceId: e.target.value })}
          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-300 outline-none transition-colors"
        >
          <option value="">— Veri Kaynağı Seçin —</option>
          {dataItems.map((dataItem) => (
            <option key={dataItem.id} value={dataItem.id}>
              {dataItem.jsonKeys?.length
                ? `${dataItem.jsonKeys.length} alan · ${dataItem.id}`
                : dataItem.id}
            </option>
          ))}
        </select>
        {dataItems.length === 0 && (
          <p className="text-xs text-gray-400 mt-1.5">
            Grafik için önce bir JSON veri kaynağı ekleyin.
          </p>
        )}
      </div>

      {selectedDataItem && selectedDataItem.jsonKeys && selectedDataItem.jsonKeys.length > 0 && (
        <>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">X Ekseni</label>
            <select
              value={item.xAxis || ''}
              onChange={(e) => updateItem({ xAxis: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-300 outline-none transition-colors"
            >
              <option value="">— X Ekseni Seçin —</option>
              {selectedDataItem.jsonKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Y Ekseni</label>
            <select
              value={item.yAxis || ''}
              onChange={(e) => updateItem({ yAxis: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-300 outline-none transition-colors"
            >
              <option value="">— Y Ekseni Seçin —</option>
              {selectedDataItem.jsonKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <PositionEditor itemId={item.id} />
    </div>
  );
}

export default ChartEditor;
