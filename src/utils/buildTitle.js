import * as Layout from "../constants/layoutConstants.js";

const buildTitle = (item, totalWidth) => {
  return {
    Textbox: {
      "@_Name": `Title_${item.id}`,
      Left: "0pt",
      Top: "0pt",
      Height: `${Layout.TITLE_HEIGHT}pt`,
      Width: `${totalWidth}pt`,
      Style: {
        VerticalAlign: Layout.TITLE_TEXT_VERTICAL_ALIGN,
        PaddingLeft: "2pt",
        PaddingRight: "2pt",
        PaddingTop: "2pt",
        PaddingBottom: "2pt",
        Border: { Style: "None" },
      },
      CanGrow: true,
      KeepTogether: true,
      Paragraphs: {
        Paragraph: {
          TextRuns: {
            TextRun: {
              Value: item.value.toLocaleUpperCase("tr"),
              Style: {
                FontFamily: Layout.FONT_FAMILY,
                FontSize: `${Layout.TITLE_FONT_SIZE}pt`,
                FontWeight: Layout.TITLE_FONT_WEIGHT,
                Color: "Black",
              },
            },
          },
          Style: { TextAlign: Layout.TITLE_TEXT_HORIZONTAL_ALIGN },
        },
      },
    },
  };
};

export { buildTitle };
