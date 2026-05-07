export default function DateRangeBlock() {
  const today = new Date().toLocaleDateString('tr-TR');
  return (
    <div style={{ textAlign: 'right', fontSize: '9pt', color: '#666', marginBottom: 10, fontStyle: 'italic' }}>
      Tarih Aralığı: {today} – {today}
    </div>
  );
}
