export default function TitleBlock({ value }) {
  if (!value?.trim()) return null;
  return (
    <div
      style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '13pt',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '2px solid #e12f27',
        color: '#111',
      }}
    >
      {value}
    </div>
  );
}
