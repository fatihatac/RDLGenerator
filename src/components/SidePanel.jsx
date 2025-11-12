import AddTitleButton from './AddTitleButton';
import AddTableButton from './AddTableButton';
import AddDataButton from './AddDataButton';


function SidePanel({reportItems,setReportItems}) {
    
    const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      type,
      ...(type === 'title' && { value: 'Yeni Başlık' }),
      ...(type === 'table' && { columns: [{ id: Date.now(), name: 'ID' }, { id: Date.now() + 1, name: 'İsim' }] }),
      ...(type === 'data' && { json: '{ "data": [] }' }),
    };
    setReportItems([...reportItems, newItem]);
  };


    return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-inner z-0">
        <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-2">Bileşenler</h2>
        <AddTitleButton onClick={() => addItem('title')} />
        <AddTableButton onClick={() => addItem('table')} />
        <AddDataButton onClick={() => addItem('data')} />
    </aside>)
}

export default SidePanel;