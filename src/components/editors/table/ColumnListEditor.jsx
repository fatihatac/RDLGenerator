import { X, GripVertical, Eye, EyeOff } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useReportStore from '../../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

export default function ColumnListEditor({ tableId, columns }) {
    const { updateColumnName, removeColumn, reorderColumn, toggleColumnVisibility } = useReportStore(
        useShallow((state) => ({
            updateColumnName: state.updateColumnName,
            removeColumn: state.removeColumn,
            reorderColumn: state.reorderColumn,
            toggleColumnVisibility: state.toggleColumnVisibility, 
        }))
    );

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;
        reorderColumn(tableId, result.source.index, result.destination.index);
    };

    return (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sütun Tanımları</label>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`columns-${tableId}`}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2"
                        >
                            {columns.length === 0 && <p className="text-xs text-gray-400 italic">Henüz sütun eklenmedi.</p>}
                            {columns.map((col, idx) => {
                                const isVisible = col.isVisible !== false;

                                 return (
                                     <Draggable key={col.id} draggableId={col.id} index={idx}>
                                         {(provided, snapshot) => (
                                             <div
                                                 key={col.id}
                                                 ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 className={`flex items-center gap-2 p-1 rounded transition-colors 
                                                     ${snapshot.isDragging ? 'bg-white shadow-md border border-gray-200' : ''} 
                                                     ${!isVisible && !snapshot.isDragging ? 'opacity-60 bg-gray-200' : ''}`}
                                             >
                                                <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                                    <GripVertical size={16} />
                                                </div>
                                                
                                                {/* Görünürlük (Aktif/Pasif) Butonu */}
                                                <button 
                                                    onClick={() => toggleColumnVisibility(tableId, col.id)} 
                                                    className={`hover:text-blue-600 transition-colors ${isVisible ? 'text-gray-400' : 'text-blue-500'}`}
                                                    title={isVisible ? "Sütunu Gizle" : "Sütunu Göster"}
                                                >
                                                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                                <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                                                
                                                <input
                                                    type="text"
                                                    value={col.name}
                                                    onChange={(e) => updateColumnName(tableId, col.id, e.target.value)}
                                                    className={`flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none transition-all 
                                                        ${!isVisible ? 'text-gray-500 bg-gray-100 line-through border-transparent' : ''}`}
                                                    placeholder="Sütun Adı (Örn: Müşteri Adı)"
                                                    readOnly={!isVisible} // Pasifken ismini değiştirmeyi engelliyoruz
                                                />


                                                {/* Silme Butonu */}
                                                <button 
                                                    onClick={() => removeColumn(tableId, col.id)} 
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Sütunu Tamamen Sil"
                                                >
                                                    <X size={16} />
                                                </button>
                                                
                                            </div>
                                            
                                        )}
                                        
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}