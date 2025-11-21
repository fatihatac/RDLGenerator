import AddTitleButton from '../actions/AddTitleButton';
import AddTableButton from '../actions/AddTableButton';
import AddDataButton from '../actions/AddDataButton';
import AddDateRangeButton from '../actions/AddDateRangeButton';


function SidePanel({ addItem, reportItems }) {

    return (
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-inner z-0">
            <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-2">Bileşenler</h2>
            <AddTitleButton onClick={() => addItem('title')} />
            <AddTableButton onClick={() => addItem('table')} />
            <AddDataButton onClick={() => addItem('data')} />
            <AddDateRangeButton onClick={() => addItem('dateRange')} />
        </aside>)
}

export default SidePanel;