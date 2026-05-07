export default function ChartPlaceholder({ item }) {
  return (
    <div
      style={{
        height: 160,
        border: '2px dashed #e0e0e0',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ccc',
        marginBottom: 16,
        gap: 8,
        fontSize: '9pt',
      }}
    >
      <div style={{ fontSize: 32 }}>📊</div>
      <div>{(item.chartType ?? 'chart').toUpperCase()} grafik</div>
    </div>
  );
}
