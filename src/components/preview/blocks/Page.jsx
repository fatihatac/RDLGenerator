import { pageStyles } from '../styles';

export default function Page({ children, isPortrait }) {
  return (
    <div
      style={{
        ...pageStyles.container,
        ...(isPortrait ? pageStyles.portrait : pageStyles.landscape),
      }}
    >
      {children}
    </div>
  );
}
