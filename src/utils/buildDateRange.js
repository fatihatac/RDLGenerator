import * as Layout from "../constants/layoutConstants.js";

const buildDateRange = (item, totalWidth) => {
  const valueExpr = `=First(Fields!${item.mappedField}.Value)`;
  return {
    Textbox: {
      "@_Name": `${item.id}`,
      Left: "0pt",
      Top: "0pt",
      Height: `${Layout.TITLE_HEIGHT}pt`,
      Width: `${totalWidth}pt`,
      Style: {
        VerticalAlign: "Middle",
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
              Value: valueExpr,
              Style: {
                FontFamily: Layout.FONT_FAMILY,
                FontSize: `${Layout.TITLE_FONT_SIZE - 1}pt`,
                Color: "Black",
              },
            },
          },
          Style: { TextAlign: "Left" },
        },
      },
    },
  };
};

export default buildDateRange