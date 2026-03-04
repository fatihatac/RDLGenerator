import { memo } from 'react';
import { Table, CalendarRange, ChartArea, FileText, FileBraces } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { ITEM_TYPES, VIEW_MODES } from '../../constants/appConstants';

// FIX: icon alanı artık JSX değil, component referansı.
// Render sırasında <btn.Icon size={20} /> ile kullanılıyor.
// Bu, modül yüklenirken React elementleri oluşturulmasını engeller.
const ACTION_BUTTONS = [
  {
    type: ITEM_TYPES.TITLE,
    Icon: FileText,
    title: 'Metin Kutusu',
    description: 'Başlık veya etiket için',
    className: 'bg-gray-50 hover:bg-blue-50 hover:border-blue-300',
    iconClassName: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
  },
  {
    type: ITEM_TYPES.TABLE,
    Icon: Table,
    title: 'Tablo',
    description: 'Veri listelemek için',
    className: 'bg-gray-50 hover:bg-green-50 hover:border-green-300',
    iconClassName: 'bg-green-100 text-green-600 group-hover:bg-green-200',
  },
  {
    type: ITEM_TYPES.DATA,
    Icon: FileBraces,
    title: 'JSON Datasource',
    description: 'JSON verisi eklemek için',
    className: 'bg-gray-50 hover:bg-yellow-50 hover:border-yellow-300',
    iconClassName: 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200',
  },
  {
    type: ITEM_TYPES.DATE_RANGE,
    Icon: CalendarRange,
    title: 'Tarih Aralığı',
    description: 'Rapor tarih aralığı',
    className: 'bg-gray-50 hover:bg-purple-50 hover:border-purple-300',
    iconClassName: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
  },
  {
    type: ITEM_TYPES.CHART,
    Icon: ChartArea,
    title: 'Grafik',
    description: 'Grafik eklemek için',
    className: 'bg-gray-50 hover:bg-pink-50 hover:border-pink-300',
    iconClassName: 'bg-pink-100 text-pink-600 group-hover:bg-pink-200',
  },
];

function SidePanel() {
  const { addItem, viewMode } = useReportStore(
    useShallow((state) => ({
      addItem: state.addItem,
      viewMode: state.viewMode,
    })),
  );

  // FIX: Tek yer koşullu render — App.jsx'teki koşul kaldırıldı
  if (viewMode === VIEW_MODES.PREVIEW || viewMode === VIEW_MODES.XML) return null;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-inner z-0 overflow-y-auto">
      <h2 className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
        Bileşenler
      </h2>

      {ACTION_BUTTONS.map((btn) => (
        <BaseAddItemButton
          key={btn.type}
          onClick={() => addItem(btn.type)}
          icon={<btn.Icon size={20} />}
          title={btn.title}
          description={btn.description}
          className={btn.className}
          iconClassName={btn.iconClassName}
        />
      ))}
    </aside>
  );
}

export default memo(SidePanel);
