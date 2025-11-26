import * as Layout from "../constants/layoutConstants.js";
import { buildGroupHierarchy } from "./buildGroupHierarchy.js";
import convertTitleCase from "./convertTitleCase.js"

function buildTable(item) {
  const columns = item.columns;

  return {
    Tablix: {
      "@_Name": `Tablix_${item.id}`,
      Left: "0pt",
      Top: `${Layout.TITLE_HEIGHT}pt`,
      Height: "37.5pt",
      Width: "504pt",
      Style: { Border: { Style: "None" } },
      DataSetName: "Dataset1",
      TablixBody: {
        TablixColumns: {
          TablixColumn: columns.map((col) => ({
            Width: `${col.width}pt`,
          })),
        },
        TablixRows: {
          TablixRow: [
            buildHeaderRow(item),
            buildDataRow(item),
            ...(item.sums?.length ? [buildSumRow(item)] : []),
          ],
        },
      },
      TablixColumnHierarchy: {
        TablixMembers: {
          TablixMember: columns.map(() => ({})),
        },
      },

      TablixRowHierarchy: buildGroupHierarchy(item.groups, item.sums),
    },
  };
}

// 🔹 HEADER ROW
function buildHeaderRow(item) {
  return {
    Height: "18.6pt",
    TablixCells: {
      TablixCell: item.columns.map((col, i) => ({
        CellContents: {
          Textbox: {
            "@_Name": `Header_${item.id}_${i}`,
            Left:"0pt",
            Top:"0pt",
            Height: `${Layout.COLUMN_HEIGHT}`,
            Width: `${col.width}pt`,
            Style: {
              VerticalAlign: Layout.COLUMN_TEXT_VERTICAL_ALIGN,
              PaddingLeft: "2pt",
              PaddingRight: "2pt",
              PaddingTop: "2pt",
              PaddingBottom: "2pt",
              Border: { Color: "LightGrey", Style: "Solid" },
            },
            CanGrow: true,
            KeepTogether: true,
            Paragraphs: {
              Paragraph: {
                TextRuns: {
                  TextRun: {
                    Value: convertTitleCase(col.name),
                    Style: {
                      FontFamily: Layout.FONT_FAMILY,
                      FontSize: "7.5pt",
                      FontWeight: "Bold",
                      Color: "black",
                    },
                  },
                },
                Style: { TextAlign: Layout.COLUMN_TEXT_HORIZONTAL_ALIGN },
              },
            },
            UserSort: {
              SortExpression: `=Fields!${col.mappedField}.Value`,
              SortExpressionScope: "Details",
            },
          },
          ColSpan:1,
          RowSpan:1,
        },
      })),
    },
  };
}

// 🔹 DATA ROW
function buildDataRow(item) {
  return {
    Height: "18.6pt",
    TablixCells: {
      TablixCell: item.columns.map((col) => ({
        CellContents: {
          Textbox: {
            "@_Name": `Data_${item.id}_${col.id}`,
            Left:"0pt",
            Top:"0pt",
            Height: "18.6pt",
            Width: `${col.width}pt`,
            Style: {
              VerticalAlign: Layout.COLUMN_TEXT_VERTICAL_ALIGN,
              PaddingLeft: "2pt",
              Border: { Color: "LightGrey", Style: "Solid" },
            },
            CanGrow: true,
            KeepTogether: true,
            Paragraphs: {
              Paragraph: {
                TextRuns: {
                  TextRun: {
                    Value:
                      col.mappedField === "RowNumber"
                        ? "=RowNumber(Nothing)"
                        : `=Fields!${col.mappedField}.Value`,
                    Style: {
                      FontFamily: Layout.FONT_FAMILY,
                      FontSize: "6.75pt",
                      Color: "black",
                    },
                  },
                },
                Style:{
                    TextAlign:"Left"
                }
              },
            },
          },
          ColSpan:1,
          RowSpan:1,
        },
      })),
    },
  };
}

// 🔹 SUM ROW
function buildSumRow(item) {
  return {
    Height: "18pt",
    TablixCells: {
      TablixCell: item.columns.map((col) => {
        const sum = item.sums?.find((s) => s.mappedField === col.mappedField);

        return {
          CellContents: {
            Textbox: {
              "@_Name": sum ? `Sum_${sum.id}` : `Empty_${col.id}`,
              Left:"0pt",
              Top:"0pt",
              Height: "18pt",
              Width: `${col.width}pt`,
              Style: {
                FontSize:"10pt",
                VerticalAlign:"Middle",
                PaddingLeft:"2pt",
                PaddingRight:"2pt",
                PaddingTop:"2pt",
                PaddingBottom:"2pt",
                Border: { Color: "LightGrey", Style: "Solid" },
              },
              CanGrow:true,
              KeepTogether:true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: sum ? `=Sum(Fields!${sum.mappedField}.Value)` : "TOPLAM",
                      Style:{
                        FontFamily:"Trebuchet MS",
                        FontSize:"6.75pt",
                        Color:"black"
                      }
                    },
                  },
                  Style:{
                    FontSize:"10pt",
                    TextAlign:"Left"
                  }
                },
              },
            },
            ColSpan:1,
            RowSpan:1,
          },
        };
      }),
    },
  };
}

export { buildTable };
