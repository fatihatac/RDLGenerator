import { EmptyReport, ReportHeader, ReportItemRenderer } from '../report';
import ReportPreview from '../preview/ReportPreview';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { LayoutTemplate, MonitorPlay } from 'lucide-react';
import { VIEW_MODES } from '../../constants/appConstants';


function MainPanel() {
    const { reportItems, viewMode, setViewMode } = useReportStore(
        useShallow((state) => ({
            reportItems: state.reportItems,
            viewMode: state.viewMode,
            setViewMode: state.setViewMode,
        }))
    );

    return (
        <main className="flex-1 relative bg-gray-50/30">

            <div className="absolute inset-0 flex flex-col">

                <div className="w-full flex justify-end px-8 py-3 backdrop-blur-md bg-transparent shadow-sm z-10 shrink-0">
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode(VIEW_MODES.DESIGN)}
                            className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all  duration-200 ${viewMode === VIEW_MODES.DESIGN
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                        >
                            <LayoutTemplate size={16} className="mr-2" />
                            Design
                        </button>
                        <button
                            onClick={() => setViewMode(VIEW_MODES.PREVIEW)}
                            className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === VIEW_MODES.PREVIEW
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                        >
                            <MonitorPlay size={16} className="mr-2" />
                            Preview
                        </button>
                    </div>
                </div>

                {/* 4. Kaydırılabilir İçerik Alanı: Sadece bu div kendi içinde scroll olur */}
                <div className="flex-1 overflow-y-auto p-8">
                    {viewMode === 'design' ? (
                        <div className="max-w-3xl mx-auto pb-12">
                            <ReportHeader count={reportItems.length} />
                            {reportItems.length === 0 ? (
                                <EmptyReport />
                            ) : (
                                <div className="space-y-6">
                                    {reportItems.map((item) => (
                                        <div key={item.id}>
                                            <ReportItemRenderer item={item} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto pb-12">
                            <ReportPreview />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default MainPanel;