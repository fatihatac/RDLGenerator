// import AddTitleButton from '../actions/AddTitleButton';
// import AddTableButton from '../actions/AddTableButton';
// import AddDataButton from '../actions/AddDataButton';
// import AddDateRangeButton from '../actions/AddDateRangeButton';
// import AddChartButton from '../actions/AddChartButton';
// import useReportStore from '../../store/useReportStore';
// import { useShallow } from 'zustand/react/shallow';

// function SidePanel() {
//     const { addItem } = useReportStore()

//     return (
//         <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-inner z-0">
//             <h2 className="text-xs font-bold text-gray-600 tracking-wider mb-2">Bileşenler</h2>
//             <AddTitleButton onClick={() => addItem('title')} />
//             <AddTableButton onClick={() => addItem('table')} />
//             <AddDataButton onClick={() => addItem('data')} />
//             <AddDateRangeButton onClick={() => addItem('dateRange')} />
//             <AddChartButton onClick={() => { addItem('chart') }} />
//         </aside>)
// }

// export default SidePanel;

// src/components/layout/SidePanel.jsx

import { Type, Table, Database, CalendarRange, BarChart3 } from 'lucide-react';
import BaseAddItemButton from '../ui/BaseAddButton';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { ITEM_TYPES } from '../../constants/appConstants'; // Bir önceki adımda oluşturduğumuz sabitler

// Buton konfigürasyonlarını tutan dizi
const ACTION_BUTTONS = [
    {
        type: ITEM_TYPES.TITLE,
        icon: <Type size={20} />,
        title: 'Başlık',
        description: 'Rapor başlığı eklemek için',
        className: 'bg-gray-50 hover:bg-blue-50 hover:border-blue-300',
        iconClassName: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
    },
    {
        type: ITEM_TYPES.TABLE,
        icon: <Table size={20} />,
        title: 'Tablo',
        description: 'Veri listelemek için',
        className: 'bg-gray-50 hover:bg-green-50 hover:border-green-300',
        iconClassName: 'bg-green-100 text-green-600 group-hover:bg-green-200'
    },
    {
        type: ITEM_TYPES.DATA,
        icon: <Database size={20} />,
        title: 'Veri Kaynağı',
        description: 'JSON verisi eklemek için',
        className: 'bg-gray-50 hover:bg-yellow-50 hover:border-yellow-300',
        iconClassName: 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200'
    },
    {
        type: ITEM_TYPES.DATE_RANGE,
        icon: <CalendarRange size={20} />,
        title: 'Tarih Aralığı',
        description: 'Tarih filtresi için',
        className: 'bg-gray-50 hover:bg-purple-50 hover:border-purple-300',
        iconClassName: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
    },
    {
        type: ITEM_TYPES.CHART,
        icon: <BarChart3 size={20} />,
        title: 'Grafik',
        description: 'Veriyi görselleştirmek için',
        className: 'bg-gray-50 hover:bg-pink-50 hover:border-pink-300',
        iconClassName: 'bg-pink-100 text-pink-600 group-hover:bg-pink-200'
    }
];

function SidePanel() {
    // Performans optimizasyonu ile global store bağlantısı
    const { addItem, viewMode } = useReportStore(
        useShallow((state) => ({
            addItem: state.addItem,
            viewMode: state.viewMode
        }))
    );

    // Eğer önizleme modundaysak SidePanel tamamen gizlenir (App.jsx temiz kalır)
    if (viewMode === 'preview') return null;

    return (
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-inner z-0 overflow-y-auto">
            <h2 className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">Bileşenler</h2>

            {/* Dinamik Render (DRY Prensi) */}
            {ACTION_BUTTONS.map((btn) => (
                <BaseAddItemButton
                    key={btn.type}
                    onClick={() => addItem(btn.type)}
                    icon={btn.icon}
                    title={btn.title}
                    description={btn.description}
                    className={btn.className}
                    iconClassName={btn.iconClassName}
                />
            ))}
        </aside>
    );
}

export default SidePanel;