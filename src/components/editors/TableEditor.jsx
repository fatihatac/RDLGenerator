// // import { Plus, Trash2, Table, X, ListOrdered, Group, Sigma, GripVertical } from 'lucide-react';
// // import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// // import useReportStore from '../../store/useReportStore';
// // import { useMemo, useEffect } from 'react';
// // import parseAndExtractJsonInfo from '../../utils/parseAndExtractJsonInfo';
// // import getMaxCharWidth from '../../utils/getMaxCharWidth';

// // function TableEditor({ item }) {
// //   const {
// //     deleteItem,
// //     reportItems,
// //     addColumn,
// //     removeColumn,
// //     updateColumnName,
// //     addRowNumberColumn,
// //     addGroup,
// //     removeGroup,
// //     updateGroupName,
// //     updateGroupMappedField,
// //     addSum,
// //     removeSum,
// //     updateSumMappedField,
// //     updateItem,
// //     reorderColumn,
// //   } = useReportStore();

// //   const dataItem = reportItems.find(i => i.type === 'data');

// //   //   <button 
// //   //   onClick={() => setActiveDataSourceId(item.id)}
// //   //   className="ml-3 text-xs font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded-full flex items-center transition-colors"
// //   // >
// //   //   Aktif Olarak Ayarla
// //   // </button>


// //   const { parsedData } = useMemo(() => {
// //     if (!dataItem?.value) return { parsedData: null };
// //     return parseAndExtractJsonInfo(dataItem.value);
// //   }, [dataItem?.value]);

// //   useEffect(() => {
// //     if (!parsedData || !Array.isArray(parsedData) || item.columns.length === 0) {
// //       return;
// //     }

// //     const updatedColumns = item.columns.map(col => {
// //       if (col.mappedField === 'RowNumber') return col;

// //       const newWidth = getMaxCharWidth(parsedData, col.mappedField, col.name);

// //       if (col.width !== newWidth) {
// //         return { ...col, width: newWidth };
// //       }
// //       return col;
// //     });

// //     const hasWidthChanged = updatedColumns.some((col, index) => col.width !== item.columns[index].width);

// //     if (hasWidthChanged) {
// //       updateItem(item.id, { columns: updatedColumns });
// //     }
// //   }, [parsedData, item, updateItem]);

// //   const handleDragEnd = (result) => {
// //     if (!result.destination) return; // Liste dışına bırakıldıysa iptal et
// //     if (result.destination.index === result.source.index) return; // Aynı yere bırakıldıysa iptal et

// //     reorderColumn(item.id, result.source.index, result.destination.index);
// //   };


// //   return (
// //     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
// //       <div className="flex justify-between items-center mb-3">
// //         <div className="flex items-center text-green-600 font-semibold">
// //           <Table size={18} className="mr-2" />
// //           <span>Veri Tablosu</span>
// //         </div>
// //         <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
// //           <Trash2 size={18} />
// //         </button>
// //       </div>

// //       {/* <div className="mb-3">
// //         <label className="block text-sm font-medium text-gray-700 mb-2">Sütun Tanımları</label>
// //         <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
// //           {item.columns.length === 0 && <p className="text-xs text-gray-400 italic">Henüz sütun eklenmedi.</p>}

// //           {item.columns.map((col, idx) => (
// //             <div key={col.id} className="flex items-center gap-2">
// //               <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
// //               <input
// //                 type="text"
// //                 value={col.name}
// //                 onChange={(e) => updateColumnName(item.id, col.id, e.target.value)}
// //                 className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
// //                 placeholder="Alan Adı (Örn: Ad)"
// //               />
// //               <button onClick={() => removeColumn(item.id, col.id)} className="text-gray-400 hover:text-red-500">
// //                 <X size={16} />
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div> */}

// //       <div className="mb-3">
// //         <label className="block text-sm font-medium text-gray-700 mb-2">Sütun Tanımları</label>

// //         {/* Sürükle Bırak Context'i */}
// //         <DragDropContext onDragEnd={handleDragEnd}>
// //           <Droppable droppableId={`columns-${item.id}`}>
// //             {(provided) => (
// //               <div
// //                 {...provided.droppableProps}
// //                 ref={provided.innerRef}
// //                 className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2"
// //               >
// //                 {item.columns.length === 0 && <p className="text-xs text-gray-400 italic">Henüz sütun eklenmedi.</p>}

// //                 {item.columns.map((col, idx) => (
// //                   <Draggable key={col.id} draggableId={col.id} index={idx}>
// //                     {(provided, snapshot) => (
// //                       <div
// //                         ref={provided.innerRef}
// //                         {...provided.draggableProps}
// //                         className={`flex items-center gap-2 p-1 rounded transition-colors ${snapshot.isDragging ? 'bg-white shadow-md border border-gray-200' : ''}`}
// //                       >
// //                         {/* Sürükleme Tutamacı */}
// //                         <div
// //                           {...provided.dragHandleProps}
// //                           className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
// //                         >
// //                           <GripVertical size={16} />
// //                         </div>

// //                         <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
// //                         <input
// //                           type="text"
// //                           value={col.name}
// //                           onChange={(e) => updateColumnName(item.id, col.id, e.target.value)}
// //                           className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
// //                           placeholder="Alan Adı (Örn: Ad)"
// //                         />
// //                         <button onClick={() => removeColumn(item.id, col.id)} className="text-gray-400 hover:text-red-500">
// //                           <X size={16} />
// //                         </button>
// //                       </div>
// //                     )}
// //                   </Draggable>
// //                 ))}
// //                 {/* Droppable için zorunlu placeholder */}
// //                 {provided.placeholder}
// //               </div>
// //             )}
// //           </Droppable>
// //         </DragDropContext>
// //       </div>

// //       <div className="mb-3">
// //         <label className="block text-sm font-medium text-gray-700 mb-2">Grup Tanımları</label>
// //         <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
// //           {(item.groups || []).length === 0 && <p className="text-xs text-gray-400 italic">Henüz grup eklenmedi.</p>}

// //           {(item.groups || []).map((group, idx) => (
// //             <div key={group.id} className="flex items-center gap-2">
// //               <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
// //               <input
// //                 type="text"
// //                 value={group.name}
// //                 onChange={(e) => updateGroupName(item.id, group.id, e.target.value)}
// //                 className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
// //                 placeholder="Grup Adı (Örn: Bölüm)"
// //               />
// //               <select
// //                 value={group.mappedField || ''}
// //                 onChange={(e) => updateGroupMappedField(item.id, group.id, e.target.value || null)}
// //                 className="w-32 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
// //               >
// //                 <option value="">Alan Seç</option>
// //                 {dataItem && dataItem.filteredJsonKeys && dataItem.filteredJsonKeys.map(key => (
// //                   <option key={key} value={key}>{key}</option>
// //                 ))}
// //               </select>
// //               <button onClick={() => removeGroup(item.id, group.id)} className="text-gray-400 hover:text-red-500"
// //               >
// //                 <X size={16} />
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="mb-3">
// //         <label className="block text-sm font-medium text-gray-700 mb-2">Toplam Tanımları</label>
// //         <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
// //           {(item.sums || []).length === 0 && <p className="text-xs text-gray-400 italic">Henüz toplam tanımı eklenmedi.</p>}

// //           {(item.sums || []).map((sum, idx) => (
// //             <div key={sum.id} className="flex items-center gap-2">
// //               <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
// //               <select
// //                 value={sum.mappedField || ''}
// //                 onChange={(e) => updateSumMappedField(item.id, sum.id, e.target.value || null)}
// //                 className="w-32 p-1.5 text-sm border border-gray-300 rounded focus:border-red-500 outline-none"
// //               >
// //                 <option value="">Alan Seç</option>
// //                 {dataItem && dataItem.filteredJsonKeys && dataItem.filteredJsonKeys.map(key => (
// //                   <option key={key} value={key}>{key}</option>
// //                 ))}
// //               </select>
// //               <button onClick={() => removeSum(item.id, sum.id)} className="text-gray-400 hover:text-red-500"
// //               >
// //                 <X size={16} />
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="flex items-center gap-4">
// //         <button
// //           onClick={() => addColumn(item.id)}
// //           className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium"
// //         >
// //           <Plus size={16} className="mr-1" /> Sütun Ekle
// //         </button>
// //         |
// //         <button
// //           onClick={() => addRowNumberColumn(item.id)}
// //           className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium"
// //         >
// //           <ListOrdered size={16} className="mr-1" /> Satır Numarası Ekle
// //         </button>
// //         |
// //         <button
// //           onClick={() => addGroup(item.id)}
// //           className='text-sm flex items-center text-gray-600 hover:text-gray-700 font-medium'
// //         >
// //           <Group size={16} className='mr-1' /> Grup Ekle
// //         </button>
// //         |
// //         <button
// //           onClick={() => addSum(item.id)}
// //           className='text-sm flex items-center text-red-600 hover:text-red-700 font-medium'
// //         >
// //           <Sigma size={16} className='mr-1' /> SUM Ekle
// //         </button>
// //       </div>
// //     </div >
// //   );
// // };

// // export default TableEditor;

// import { Plus, Trash2, Table, ListOrdered, Group, Sigma } from 'lucide-react';
// import { useMemo, useEffect } from 'react';
// import useReportStore from '../../store/useReportStore';
// import parseAndExtractJsonInfo from '../../utils/parseAndExtractJsonInfo';
// import getMaxCharWidth from '../../utils/getMaxCharWidth';

// // Alt Bileşenleri İçeri Aktarıyoruz
// import ColumnListEditor from './table/ColumnListEditor';
// import GroupListEditor from './table/GroupListEditor';
// import SumListEditor from './table/SumListEditor';

// function TableEditor({ item }) {
//   const { deleteItem, reportItems, addColumn, addRowNumberColumn, addGroup, addSum, updateItem } = useReportStore();

//   const dataItem = reportItems.find(i => i.type === 'data');
//   const jsonKeys = dataItem?.filteredJsonKeys || [];

//   // TODO: Bu mantık (Logic) kısmı bir sonraki refactoring adımında Custom Hook'a taşınacak
//   const { parsedData } = useMemo(() => {
//     if (!dataItem?.value) return { parsedData: null };
//     return parseAndExtractJsonInfo(dataItem.value);
//   }, [dataItem?.value]);

//   useEffect(() => {
//     if (!parsedData || !Array.isArray(parsedData) || item.columns.length === 0) return;

//     const updatedColumns = item.columns.map(col => {
//       if (col.mappedField === 'RowNumber') return col;
//       const newWidth = getMaxCharWidth(parsedData, col.mappedField, col.name);
//       return col.width !== newWidth ? { ...col, width: newWidth } : col;
//     });

//     const hasWidthChanged = updatedColumns.some((col, index) => col.width !== item.columns[index].width);
//     if (hasWidthChanged) updateItem(item.id, { columns: updatedColumns });
//   }, [parsedData, item, updateItem]);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
//       {/* Üst Başlık ve Silme Butonu */}
//       <div className="flex justify-between items-center mb-3">
//         <div className="flex items-center text-green-600 font-semibold">
//           <Table size={18} className="mr-2" />
//           <span>Data Table</span>
//         </div>
//         <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
//           <Trash2 size={18} />
//         </button>
//       </div>

//       {/* Alt Bileşenlerin Çağrılması */}
//       <ColumnListEditor tableId={item.id} columns={item.columns} />
//       <GroupListEditor tableId={item.id} groups={item.groups} jsonKeys={jsonKeys} />
//       <SumListEditor tableId={item.id} sums={item.sums} jsonKeys={jsonKeys} />

//       {/* Aksiyon Butonları */}
//       <div className="flex items-center gap-4 mt-4">
//         <button onClick={() => addColumn(item.id)} className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium">
//           <Plus size={16} className="mr-1" /> Sütun Ekle
//         </button>
//         <span className="text-gray-300">|</span>
//         <button onClick={() => addRowNumberColumn(item.id)} className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium">
//           <ListOrdered size={16} className="mr-1" /> Satır Numarası Ekle
//         </button>
//         <span className="text-gray-300">|</span>
//         <button onClick={() => addGroup(item.id)} className='text-sm flex items-center text-gray-600 hover:text-gray-700 font-medium'>
//           <Group size={16} className='mr-1' /> Grup Ekle
//         </button>
//         <span className="text-gray-300">|</span>
//         <button onClick={() => addSum(item.id)} className='text-sm flex items-center text-red-600 hover:text-red-700 font-medium'>
//           <Sigma size={16} className='mr-1' /> Toplam Ekle
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TableEditor;


import { Plus, Trash2, Table, ListOrdered, Group, Sigma } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import useTableData from '../../hooks/useTableData'; // Hook'umuzu import ettik

// Alt Bileşenler
import ColumnListEditor from './table/ColumnListEditor';
import GroupListEditor from './table/GroupListEditor';
import SumListEditor from './table/SumListEditor';

function TableEditor({ item }) {
  // Store'dan sadece UI butonlarının tıklanınca çalıştıracağı fonksiyonları çekiyoruz
  const { deleteItem, addColumn, addRowNumberColumn, addGroup, addSum } = useReportStore();

  const { jsonKeys } = useTableData(item);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      {/* Üst Başlık ve Silme Butonu */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-green-600 font-semibold">
          <Table size={18} className="mr-2" />
          <span>Data Table</span>
        </div>
        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Alt Bileşenlerin Çağrılması */}
      <ColumnListEditor tableId={item.id} columns={item.columns} />
      <GroupListEditor tableId={item.id} groups={item.groups} jsonKeys={jsonKeys} />
      <SumListEditor tableId={item.id} sums={item.sums} jsonKeys={jsonKeys} />

      {/* Aksiyon Butonları */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => addColumn(item.id)} className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium">
          <Plus size={16} className="mr-1" /> Add Column
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => addRowNumberColumn(item.id)} className="text-sm flex items-center text-blue-600 hover:text-blue-700 font-medium">
          <ListOrdered size={16} className="mr-1" /> Add Row No
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => addGroup(item.id)} className='text-sm flex items-center text-gray-600 hover:text-gray-700 font-medium'>
          <Group size={16} className='mr-1' /> Add Group
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => addSum(item.id)} className='text-sm flex items-center text-red-600 hover:text-red-700 font-medium'>
          <Sigma size={16} className='mr-1' /> Add Sum
        </button>
      </div>
    </div>
  );
}

export default TableEditor;