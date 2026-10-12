import { escapeXml } from '../helpers/escapeXml.js';

const buildPageSection = (items, sectionType, totalWidth, settings) => {
  const sectionItems = items.filter(
    (item) => item.section === sectionType && item.type !== "data"
  );
  if (sectionItems.length === 0) return null;

  // Sayfa margin'i RDL'de 0 yazıldığı için (bkz. applyPageMargins) header/footer
  // öğeleri margin kadar içeriden başlatılır.
  const offsetLeft = settings.marginLeft ?? 0;
  const offsetTop = sectionType === 'header' ? (settings.marginTop ?? 0) : 0;
  const extraHeight = sectionType === 'footer' ? (settings.marginBottom ?? 0) : 0;

  const reportItems = {};
  sectionItems.forEach((item, index) => {
    const textbox = {
      '@_Name': `Page${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}_${item.id || index}`,
      Left: `${(item.left ?? 0) + offsetLeft}pt`,
      Top: `${(item.top ?? 0) + offsetTop}pt`,
      Height: `${item.height ?? 20}pt`,
      Width: `${item.width ?? totalWidth}pt`,
      Style: {
        VerticalAlign: item.style?.verticalAlign ?? 'Middle',
        PaddingLeft: '2pt', PaddingRight: '2pt',
        PaddingTop: '2pt', PaddingBottom: '2pt',
        Border: { Style: item.style?.borderStyle ?? 'None' },
      },
      CanGrow: item.canGrow ?? true,
      KeepTogether: true,
      Paragraphs: {
        Paragraph: {
          TextRuns: {
            TextRun: {
              Value: item.expressionValue || item.value || '',
              Style: {
                FontFamily: item.style?.fontFamily ?? settings.fontFamily,
                FontSize: item.style?.fontSize ? `${item.style.fontSize}pt` : `${settings.fontSize}pt`,
                FontWeight: item.style?.fontWeight ?? 'Normal',
                Color: item.style?.color ?? 'Black',
              },
            },
          },
          Style: { TextAlign: item.style?.textAlign ?? 'Center' },
        },
      },
    };

    reportItems[`Textbox${index}`] = textbox;
  });

  return {
    Style: { Border: { Style: 'None' } },
    Height: `${offsetTop + extraHeight + sectionItems.reduce((max, item) => Math.max(max, (item.top || 0) + (item.height || 20)), 0)}pt`,
    PrintOnFirstPage: "true",
    PrintOnLastPage: "true",
    ReportItems: reportItems,
  };
};

export { buildPageSection };
