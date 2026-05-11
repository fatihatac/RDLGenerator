function buildLegend(item, settings, totalWidth) {
  const value   = item.value   ?? '';
  const valueTr = item.valueTr ?? '';

  if (!value && !valueTr) return null;

  return {
    Textbox: {
      '@_Name': item.id ?? 'legend',
      Left:    `${item._left ?? item.left ?? 0}pt`,
      Top:     `${item._top  ?? item.top  ?? 0}pt`,
      Height:  `${settings.legendHeight ?? 43.5}pt`,
      Width:   `${item.width ?? totalWidth ?? 400}pt`,
      Style: {
        BackgroundColor: item.style?.backgroundColor ?? '#cccbcb',
        PaddingLeft:     '2pt',
        PaddingRight:    '2pt',
        PaddingTop:      '2pt',
        PaddingBottom:   '2pt',
        Border:          { Style: 'None' },
      },
      CanGrow:      true,
      KeepTogether: true,
      Paragraphs: {
        Paragraph: [
          // Paragraph 0 — English legend text
          {
            TextRuns: {
              TextRun: {
                Value: value,
                Style: {
                  FontFamily: item.style?.fontFamily ?? 'Trebuchet MS',
                  Color:      'Black',
                },
              },
            },
            Style: { TextAlign: 'Left' },
          },
          // Paragraph 1 — Turkish legend text
          {
            TextRuns: {
              TextRun: {
                Value: valueTr,
                Style: {
                  FontFamily: item.style?.fontFamily ?? 'Trebuchet MS',
                  Color:      'Black',
                },
              },
            },
            Style: { TextAlign: 'Left' },
          },
        ],
      },
    },
  };
}

export { buildLegend };
