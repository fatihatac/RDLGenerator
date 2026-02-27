// // import EmptyReport from '../report/EmptyReport';
// // import ReportHeader from '../report/ReportHeader';
// // import ReportItemRenderer from '../report/ReportItemRenderer';
// // import useReportStore from '../../store/useReportStore';
// // import ReportPreview from '../preview/ReportPreview';
// // import { LayoutTemplate, MonitorPlay } from 'lucide-react';

// // function MainPanel() {
// //     const { reportItems, viewMode, setViewMode } = useReportStore()


// //     return (
// //         <main className="flex-1 p-8 overflow-y-auto">
// //             <div className="max-w-3xl mx-auto">
// //                 <ReportHeader count={reportItems.length} />
// //                 {reportItems.length === 0 ? (
// //                     <EmptyReport />
// //                 ) : (
// //                     <div className="space-y-6">
// //                         {reportItems.map((item) => (
// //                             <div key={item.id}>
// //                                 <ReportItemRenderer
// //                                     item={item}
// //                                 />
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>
// //         </main>
// //     );
// // }

// // export default MainPanel;

// import EmptyReport from '../report/EmptyReport';
// import ReportHeader from '../report/ReportHeader';
// import ReportItemRenderer from '../report/ReportItemRenderer';
// import ReportPreview from '../preview/ReportPreview';
// import useReportStore from '../../store/useReportStore';
// import { LayoutTemplate, MonitorPlay } from 'lucide-react';

// function MainPanel() {
//     const { reportItems, viewMode, setViewMode } = useReportStore();

//     return (
//         <main className="flex-1 overflow-y-auto relative bg-gray-50/30">
//             {/* Elegant View Mode Switcher */}
//             <div className="sticky top-0 z-20 w-full flex justify-center py-3 bg-gray-100/60 backdrop-blur-md border-b border-gray-200/50">
//                 <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex items-center">
//                     <button
//                         onClick={() => setViewMode('design')}
//                         className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'design'
//                             ? 'bg-red-50 text-red-600 shadow-sm'
//                             : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                     >
//                         <LayoutTemplate size={16} className="mr-2" />
//                         Design
//                     </button>
//                     <button
//                         onClick={() => setViewMode('preview')}
//                         className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview'
//                             ? 'bg-green-50 text-green-600 shadow-sm'
//                             : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                     >
//                         <MonitorPlay size={16} className="mr-2" />
//                         Preview
//                     </button>
//                 </div>
//             </div>

//             {/* Content Area */}
//             <div className="p-8">
//                 {viewMode === 'design' ? (
//                     <div className="max-w-3xl mx-auto">
//                         <ReportHeader count={reportItems.length} />
//                         {reportItems.length === 0 ? (
//                             <EmptyReport />
//                         ) : (
//                             <div className="space-y-6">
//                                 {reportItems.map((item) => (
//                                     <div key={item.id}>
//                                         <ReportItemRenderer item={item} />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="max-w-5xl mx-auto">
//                         <ReportPreview />
//                     </div>
//                 )}
//             </div>
//         </main>
//     );
// }

// export default MainPanel;
import EmptyReport from '../report/EmptyReport';
import ReportHeader from '../report/ReportHeader';
import ReportItemRenderer from '../report/ReportItemRenderer';
import ReportPreview from '../preview/ReportPreview';
import useReportStore from '../../store/useReportStore';
import { LayoutTemplate, MonitorPlay } from 'lucide-react';

function MainPanel() {
    const { reportItems, viewMode, setViewMode } = useReportStore();

    return (
        <main className="flex-1 relative bg-gray-50/30">

            <div className="absolute inset-0 flex flex-col">

                <div className="w-full flex justify-center py-3 backdrop-blur-md bg-transparent shadow-sm z-10 shrink-0">
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode('design')}
                            className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all  duration-200 ${viewMode === 'design'
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                        >
                            <LayoutTemplate size={16} className="mr-2" />
                            Design
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'preview'
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