import { X, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useReportStore from '../../../store/useReportStore';

export default function ColumnListEditor({ tableId, columns }) {
    const { updateColumnName, removeColumn, reorderColumn } = useReportStore();

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

                            {columns.map((col, idx) => (
                                <Draggable key={col.id} draggableId={col.id} index={idx}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`flex items-center gap-2 p-1 rounded transition-colors ${snapshot.isDragging ? 'bg-white shadow-md border border-gray-200' : ''}`}
                                        >
                                            <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                                <GripVertical size={16} />
                                            </div>
                                            <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                                            <input
                                                type="text"
                                                value={col.name}
                                                onChange={(e) => updateColumnName(tableId, col.id, e.target.value)}
                                                className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
                                                placeholder="Field Name (e.g. Name)"
                                            />
                                            <button onClick={() => removeColumn(tableId, col.id)} className="text-gray-400 hover:text-red-500">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}