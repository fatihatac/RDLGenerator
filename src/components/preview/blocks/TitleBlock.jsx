import usePreviewFonts from '../../../hooks/usePreviewFonts';

export default function TitleBlock({ value }) {
  const fonts = usePreviewFonts();
  if (!value?.trim()) return null;
  return (
    <div
      style={{
        textAlign: 'center',
        ...fonts.title,
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
