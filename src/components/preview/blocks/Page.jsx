import { pageStyles } from '../styles';

// width/height/padding pt cinsinden verilirse RDL'deki gerçek sayfa ölçüsü
// ve kenar boşlukları kullanılır; verilmezse eski sabit A4 görünümü.
export default function Page({ children, isPortrait, width, height, padding }) {
  const sized = width && height
    ? { width: `${width}pt`, minHeight: `${height}pt`, padding, overflowX: 'auto' }
    : isPortrait ? pageStyles.portrait : pageStyles.landscape;

  return (
    <div style={{ ...pageStyles.container, ...sized }}>
      {children}
    </div>
  );
}
