function ReportHeader({ count }) {
    return (
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Rapor Taslağı</h2>
            <span className="text-sm text-gray-500">{count} bileşen eklendi</span>
        </div>
    );
}

export default ReportHeader