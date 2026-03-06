import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';

const buildDateRange = (item, totalWidth, settings = DEFAULT_LAYOUT_SETTINGS) => {
  const valueExpr = `=First(Fields!${item.mappedField}.Value)`;

  return {
    Textbox: {
      '@_Name': `${item.id}`,
      Left:     `${item._left ?? 0}pt`,
      Top:      `${item._top ?? 0}pt`,
      Height:   `${settings.titleHeight}pt`,
      Width:    `${totalWidth}pt`,
      Style: {
        VerticalAlign: 'Middle',
        PaddingLeft:   '2pt',
        PaddingRight:  '2pt',
        PaddingTop:    '2pt',
        PaddingBottom: '2pt',
        Border: { Style: 'None' },
      },
      CanGrow:      true,
      KeepTogether: true,
      Paragraphs: {
        Paragraph: {
          TextRuns: {
            TextRun: {
              Value: valueExpr,
              Style: {
                FontFamily: settings.fontFamily,
                FontSize:   `${settings.titleFontSize - 1}pt`,
                Color:      'Black',
              },
            },
          },
          Style: { TextAlign: 'Left' },
        },
      },
    },
  };
};

export default buildDateRange;
