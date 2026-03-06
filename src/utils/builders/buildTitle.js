import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';

const buildTitle = (item, totalWidth, settings = DEFAULT_LAYOUT_SETTINGS) => {
  return {
    Textbox: {
      '@_Name': `${item.id}`,
      Left:     `${item._left ?? 0}pt`,
      Top:      `${item._top ?? 0}pt`,
      Height:   `${settings.titleHeight}pt`,
      Width:    `${totalWidth}pt`,
      Style: {
        VerticalAlign: settings.titleVAlign,
        PaddingLeft:   '2pt',
        PaddingRight:  '2pt',
        PaddingTop:    '2pt',
        PaddingBottom: '2pt',
        Border: { Style: 'None' },
      },
      CanGrow:       true,
      KeepTogether:  true,
      Paragraphs: {
        Paragraph: {
          TextRuns: {
            TextRun: {
              Value: item.value.toLocaleUpperCase('tr'),
              Style: {
                FontFamily: settings.fontFamily,
                FontSize:   `${settings.titleFontSize}pt`,
                FontWeight: settings.titleFontWeight,
                Color:      'Black',
              },
            },
          },
          Style: { TextAlign: settings.titleHAlign },
        },
      },
    },
  };
};

export { buildTitle };
