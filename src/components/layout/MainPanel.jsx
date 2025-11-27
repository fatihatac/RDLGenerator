import EmptyReport from '../report/EmptyReport';
import ReportHeader from '../report/ReportHeader';
import ReportItemRenderer from '../report/ReportItemRenderer';
import useReportStore from '../../store/useReportStore';



function MainPanel() {
    const {reportItems} = useReportStore()

    return (
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <ReportHeader count={reportItems.length} />
                {reportItems.length === 0 ? (
                    <EmptyReport />
                ) : (
                    <div className="space-y-6">
                        {reportItems.map((item) => (
                            <div key={item.id}>
                                <ReportItemRenderer
                                    item={item}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MainPanel;
