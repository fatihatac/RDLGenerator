function buildLegend({ top, width, left } = {}) {
  return {
    Textbox: {
      '@_Name': 'legend',
      Left: `${left ?? 0}pt`,
      Top: `${top ?? 0}pt`,
      Height: '43.5pt',
      Width: `${width ?? 400}pt`,
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
                  Value: 'W = Worked Days                O = OFF                       P = Paid Leave            UL = Unpaid Leave          S = Sick Leave                 PS = Paid Sick Leave                                V = Vacation        A = Absent                 FT = Free Time',
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
                Value: 'W = Normal Mesai               O = Hafta Tatili            P = Ücretli Izin            UL=Ücretsiz Izin             S=SGK Raporlu Ucretsiz    PS = SGK Raporlu Ucretli (Vizite)             V = Yıllık İzin       A = Devamsızlık          FT = Denkleştirme Izni',
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
