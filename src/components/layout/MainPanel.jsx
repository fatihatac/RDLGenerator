import { memo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { EmptyReport, ReportHeader, ReportItemRenderer } from '../report';
import ReportPreview from '../preview/ReportPreview';
import XmlPreview from '../preview/XmlPreview';
import ErrorBoundary from '../common/ErrorBoundary';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { LayoutTemplate, MonitorPlay, Code2 } from 'lucide-react';
import { VIEW_MODES } from '../../constants/appConstants';

// ---------------------------------------------------------------------------
// Sekme tanımları — yeni sekme eklemek için sadece bu diziye satır ekle
// ---------------------------------------------------------------------------
const TABS = [
  { mode: VIEW_MODES.DESIGN,  label: 'Design',  Icon: LayoutTemplate, activeColor: 'text-red-600'   },
  { mode: VIEW_MODES.PREVIEW, label: 'Preview', Icon: MonitorPlay,    activeColor: 'text-green-600' },
  { mode: VIEW_MODES.XML,     label: 'XML',     Icon: Code2,          activeColor: 'text-blue-600'  },
];

function MainPanel() {
  const { reportItems, viewMode, setViewMode, reorderItems, pushHistory } = useReportStore(
    useShallow((state) => ({
      reportItems:  state.reportItems,
      viewMode:     state.viewMode,
      setViewMode:  state.setViewMode,
      reorderItems: state.reorderItems,
      pushHistory:  state.pushHistory,
    })),
  );

  // Item drag-drop sıralama
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    pushHistory();
    reorderItems(result.source.index, result.destination.index);
  };

  return (
    <main className="flex-1 relative bg-gray-50/30">
      <div className="absolute inset-0 flex flex-col">

        {/* Sekme çubuğu */}
        <div className="w-full flex justify-end px-8 py-3 backdrop-blur-md bg-transparent shadow-sm z-10 shrink-0">
          <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-0.5">
            {TABS.map(({ mode, label, Icon, activeColor }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === mode
                    ? `bg-white ${activeColor} shadow-sm`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* İçerik alanı */}
        <div className="flex-1 overflow-y-auto p-8">

          {/* ── DESIGN ── */}
          {viewMode === VIEW_MODES.DESIGN && (
            <div className="max-w-3xl mx-auto pb-12">
              <ReportHeader count={reportItems.length} />
              {reportItems.length === 0 ? (
                <EmptyReport />
              ) : (
                // Sürükle-bırak ile item sıralama
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="report-items">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-4"
                      >
                        {reportItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`transition-shadow ${snapshot.isDragging ? 'shadow-2xl rotate-1' : ''}`}
                              >
                                {/* Sürükleme tutacağı + içerik */}
                                <div className="flex items-start gap-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mt-4 p-1.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0"
                                    title="Sürükleyerek sırala"
                                  >
                                    ⠿
                                  </div>
                                  <div className="flex-1">
                                    {/* ErrorBoundary: her item izole — biri çökerse diğerleri etkilenmez */}
                                    <ErrorBoundary key={item.id}>
                                      <ReportItemRenderer item={item} />
                                    </ErrorBoundary>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          )}

          {/* ── PREVIEW ── */}
          {viewMode === VIEW_MODES.PREVIEW && (
            <div className="max-w-5xl mx-auto pb-12">
              <ErrorBoundary>
                <ReportPreview />
              </ErrorBoundary>
            </div>
          )}

          {/* ── XML ── */}
          {viewMode === VIEW_MODES.XML && (
            <div className="max-w-5xl mx-auto pb-12">
              <ErrorBoundary>
                <XmlPreview />
              </ErrorBoundary>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default memo(MainPanel);
