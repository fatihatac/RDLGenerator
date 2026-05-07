import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';
import { escapeXml } from '../helpers/escapeXml.js';

const buildTextbox = (item, _tw, _th, _dsm, _all, settings = DEFAULT_LAYOUT_SETTINGS) => {
  return {
    Textbox: {
      '@_Name': item.id,
      Left:     `${item.left ?? 0}pt`,
      Top:      `${item.top ?? 0}pt`,
      Height:   `${item.height ?? 20}pt`,
      Width:    `${item.width ?? 100}pt`,
      Style: {
        VerticalAlign:   item.style?.verticalAlign ?? 'Middle',
        PaddingLeft:     '2pt',
        PaddingRight:    '2pt',
        PaddingTop:      '2pt',
        PaddingBottom:   '2pt',
        Border:          { Style: item.style?.borderStyle ?? 'None' },
        BackgroundColor: item.expressionValue ? item.expressionValue : (item.style?.backgroundColor ?? undefined),
      },
      CanGrow:       item.canGrow ?? true,
      KeepTogether:  item.keepTogether ?? true,
      Paragraphs: {
        Paragraph: {
          TextRuns: {
            TextRun: {
              Value: item.expressionValue ? item.expressionValue : escapeXml(item.value ?? ''),
              Style: {
                FontFamily: item.style?.fontFamily ?? settings.fontFamily,
                FontSize:   item.style?.fontSize ? `${item.style.fontSize}pt` : `${settings.fontSize}pt`,
                FontWeight: item.style?.fontWeight ?? 'Normal',
                Color:      item.style?.color ?? 'Black',
              },
            },
          },
          Style: { TextAlign: item.style?.textAlign ?? 'Left' },
        },
      },
    },
  };
};

export { buildTextbox };
