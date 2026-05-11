function buildLegend() {
  return {
    Textbox: {
      '@_Name': 'legend',
      Left: '-2.25000pt',
      Top: '45.75pt',
      Height: '43.5pt',
      Width: '1062.75pt',
      Style: {
        BackgroundColor: '#cccbcb',
        PaddingLeft: '2pt',
        PaddingRight: '2pt',
        PaddingTop: '2pt',
        PaddingBottom: '2pt',
        Border: { Style: 'None' },
      },
      CanGrow: true,
      KeepTogether: true,
      Paragraphs: {
        Paragraph: [
          // Paragraph 0 — 2 TextRuns (header + English legend)
          {
            TextRuns: {
              TextRun: [
                {
                  Value: '',
                  Style: { FontFamily: 'Trebuchet MS', Color: 'Black' },
                },
                {
                  Value: 'W: Working | O: Overtime | P: Paid Leave | UL: Unpaid Leave | S: Sick Leave',
                  Style: { FontFamily: 'Trebuchet MS', Color: 'Black' },
                },
              ],
            },
            Style: { TextAlign: 'Left' },
          },
          // Paragraph 1 — 1 TextRun (empty spacer)
          {
            TextRuns: {
              TextRun: {
                Value: '',
                Style: { FontSize: '8.25pt', Color: 'Black' },
              },
            },
            Style: { TextAlign: 'Left' },
          },
          // Paragraph 2 — 1 TextRun (Turkish legend)
          {
            TextRuns: {
              TextRun: {
                Value: 'PS: Puantaj Sorumlusu | V: Vizeli | A: Aylıklı | FT: Full Time',
                Style: { FontFamily: 'Trebuchet MS', Color: 'Black' },
              },
            },
            Style: { TextAlign: 'Left' },
          },
          // Paragraph 3 — 1 TextRun (empty bottom spacer)
          {
            TextRuns: {
              TextRun: {
                Value: '',
                Style: { FontFamily: 'Trebuchet MS', FontSize: '9.75pt', Color: 'Black' },
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
