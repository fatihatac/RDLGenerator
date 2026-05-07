export default function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: '#ccc',
        gap: 12,
      }}
    >
      <div style={{ fontSize: 40 }}>📄</div>
      <div style={{ fontSize: '10pt' }}>Önizleme için bileşen ve veri kaynağı ekleyin.</div>
    </div>
  );
}
