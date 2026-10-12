export default function ChartPlaceholder({ item, height }) {
  return (
    <div
      style={{
        height: height ? `${height}pt` : 160,
        boxSizing: 'border-box',
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
