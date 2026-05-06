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
        <div className="w-full bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
          {TABS.map(({ mode, label, Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                viewMode === mode
                  ? 'border-[#e12f27] text-[#e12f27]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
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
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="report-items">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-4 rounded-xl transition-colors duration-200 ${
                          snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        {reportItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`transition-all duration-150 ${
                                  snapshot.isDragging
                                    ? 'shadow-2xl scale-[1.02] rotate-[0.5deg] opacity-95 z-50'
                                    : 'shadow-none'
                                }`}
                              >
                                {/* Sürükleme tutacağı — sol kenar şeridi */}
                                <div className="flex items-stretch gap-0">
                                  <div
                                    {...provided.dragHandleProps}
                                    className={`
                                      w-2 rounded-l-lg cursor-grab active:cursor-grabbing
                                      flex-shrink-0 transition-colors duration-150
                                      ${snapshot.isDragging
                                        ? 'bg-blue-400'
                                        : 'bg-gray-200 hover:bg-blue-300'
                                      }
                                    `}
                                    title="Sürükleyerek sırala"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <ErrorBoundary>
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
            <ErrorBoundary>
              <ReportPreview />
            </ErrorBoundary>
          )}

          {/* ── XML ── */}
          {viewMode === VIEW_MODES.XML && (
            <div className="max-w-5xl mx-auto">
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
