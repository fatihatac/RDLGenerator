import * as Layout from "../constants/layoutConstants.js";
import convertTitleCase from "./convertTitleCase.js";

const buildTableHierarchy = (groups, sums) => {
  if (!groups || groups.length === 0) {
    const members = [
      { TablixMember: { KeepWithGroup: "After" } }, // Header Row
      { TablixMember: { Group: { "@_Name": "Details" } } } // Details Row
    ];

    if (sums && sums.length > 0) {
      members.push({ TablixMember: { KeepWithGroup: "Before" } });
    }

    return {
      TablixMembers: {
        TablixMember: members.map(m => m.TablixMember)
      }
    };
  }

  const createHeaderHierarchy = (index) => {
    if (index >= groups.length) {
      return { TablixMember: { KeepWithGroup: "After" } };
    }

    const group = groups[index];

    return {
      TablixMember: {
        TablixHeader: {
          Size: "72pt",
          CellContents: {
            Textbox: {
              "@_Name": `GroupHeaderLabel_${group.id || index}_${Math.random().toString(36)}`,
              Left: "0in", Top: "0in", Height: "18.6pt", Width: "72pt",
              Style: {
                FontSize: "10.00003pt",
                VerticalAlign: "Middle",
                PaddingLeft: "2pt", PaddingRight: "2pt", PaddingTop: "2pt", PaddingBottom: "2pt",
                Border: { Color: "LightGrey", Style: "Solid" },
              },
              CanGrow: true, KeepTogether: true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: convertTitleCase(group.name || `Grup ${index + 1}`),
                      Style: {
                        FontFamily: Layout.FONT_FAMILY,
                        FontSize: `${Layout.COLUMN_DATA_FONT_SIZE}pt`,
                        FontWeight: "Bold",
                        Color: "black"
                      }
                    }
                  },
                  Style: { TextAlign: "Left" }
                }
              },
              UserSort: {
                SortExpression: `=Fields!${group.mappedField}.Value`,
                SortExpressionScope: `Group_${(group.name || `Group${index}`).replace(/\s+/g, '')}_${group.id || index}`
              }
            }
          }
        },
        TablixMembers: createHeaderHierarchy(index + 1),
        KeepWithGroup: "After"
      }
    };
  };

  const createSumHierarchy = (currentIndex, labelIndex) => {
    if (currentIndex >= groups.length) {
      return { TablixMember: { KeepWithGroup: "Before" } };
    }

    const value = currentIndex === labelIndex ? "TOPLAM" : "";

    return {
      TablixMember: {
        TablixHeader: {
          Size: "72pt",
          CellContents: {
            Textbox: {
              "@_Name": `GroupFooterLabel_${currentIndex}_${Math.random().toString(36)}`,
              Left: "0in", Top: "0in", Height: "18pt", Width: "72pt",
              Style: {
                VerticalAlign: "Middle",
                PaddingLeft: "2pt", PaddingRight: "2pt", PaddingTop: "2pt", PaddingBottom: "2pt",
                Border: { Color: "LightGrey", Style: "Solid" }
              },
              CanGrow: true, KeepTogether: true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: value,
                      Style: {
                        FontFamily: Layout.FONT_FAMILY,
                        FontSize: "10pt",
                        FontWeight: "Bold",
                        Color: "black"
                      }
                    }
                  },
                  Style: { TextAlign: "Left" }
                }
              }
            }
          }
        },
        TablixMembers: createSumHierarchy(currentIndex + 1, labelIndex),
        KeepWithGroup: "Before"
      }
    };
  };

  const createDataHierarchy = (index) => {
    if (index >= groups.length) {
      return {
        TablixMember: { Group: { "@_Name": "Details" } }
      };
    }

    const group = groups[index];
    const groupNameBase = group.name ? group.name.replace(/\s+/g, '') : `Group${index}`;
    const uniqueGroupName = `Group_${groupNameBase}_${group.id || index}`;


    const nextLevelMember = createDataHierarchy(index + 1);

    const innerMembers = [];

    innerMembers.push(nextLevelMember.TablixMember);


    if (sums && sums.length > 0) {
      const footerMember = createSumHierarchy(index + 1, index + 1);
      innerMembers.push(footerMember.TablixMember);
    }

    return {
      TablixMember: {
        Group: {
          "@_Name": uniqueGroupName,
          GroupExpressions: {
            GroupExpression: `=Fields!${group.mappedField}.Value`
          }
        },
        SortExpressions: {
          SortExpression: {
            Value: `=Fields!${group.mappedField}.Value`
          }
        },
        TablixHeader: {
          Size: "72pt",
          CellContents: {
            Textbox: {
              "@_Name": `GroupHeaderValue_${uniqueGroupName}`,
              Left: "0in", Top: "0in", Height: "18.6pt", Width: "72pt",
              Style: {
                FontSize: "10.00003pt",
                VerticalAlign: "Middle",
                PaddingLeft: "2pt", PaddingRight: "2pt", PaddingTop: "2pt", PaddingBottom: "2pt",
                Border: { Color: "LightGrey", Style: "Solid" }
              },
              CanGrow: true, KeepTogether: true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: `=Fields!${group.mappedField}.Value`,
                      Style: {
                        FontFamily: "Trebuchet MS",
                        FontSize: "6.75002pt",
                        FontWeight: "Bold",
                        Color: "black"
                      }
                    }
                  },
                  Style: { FontSize: "10.00003pt", TextAlign: "Left" }
                }
              }
            }
          }
        },
        TablixMembers: {
          TablixMember: innerMembers
        }
      }
    };
  };

  const members = [];

  members.push(createHeaderHierarchy(0).TablixMember);

  members.push(createDataHierarchy(0).TablixMember);

  return {
    TablixMembers: {
      TablixMember: members
    }
  };
};


const buildTable = (item) => {
  const processedColumns = item.columns;
  console.log(item);

  const tablixColumns = processedColumns.map((col) => ({
    TablixColumn: { Width: `${col.width}pt` },
  }));

  const headerCells = processedColumns.map((col, index) => {
    const textbox = {
      "@_Name": `Header_${item.id}_${index}`,
      Left: "0pt",
      Top: "0pt",
      Height: Layout.COLUMN_HEIGHT,
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
                FontSize: `${Layout.COLUMN_DATA_FONT_SIZE}pt`,
                FontWeight: Layout.TITLE_FONT_WEIGHT,
                Color: "black",
              },
            },
          },
          Style: { TextAlign: Layout.COLUMN_TEXT_HORIZONTAL_ALIGN },
        },
      },
    };

    if (col.mappedField !== "RowNumber") {
      textbox.UserSort = {
        SortExpression: `=Fields!${col.mappedField}.Value`,
        SortExpressionScope: "Details",
      };
    }

    return {
      TablixCell: {
        CellContents: {
          Textbox: textbox,
          ColSpan: 1,
          RowSpan: 1,
        },
      },
    };
  });

  const dataCells = processedColumns.map((col, index) => {
    const valueExpr =
      col.mappedField === "RowNumber"
        ? "=RowNumber(nothing)"
        : `=Fields!${col.mappedField}.Value`;

    return {
      TablixCell: {
        CellContents: {
          Textbox: {
            "@_Name": `Data_${item.id}_${index}`,
            Left: "0in",
            Top: "0in",
            Height: "18.6pt",
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
                    Value: valueExpr,
                    Style: {
                      FontFamily: Layout.FONT_FAMILY,
                      FontSize: "6.75pt",
                      Color: "black",
                    },
                  },
                },
                Style: { TextAlign: Layout.COLUMN_TEXT_HORIZONTAL_ALIGN },
              },
            },
          },
          ColSpan: 1,
          RowSpan: 1,
        },
      },
    };
  });

  let sumCells = null;
  if (item.sums && item.sums.length > 0) {
    sumCells = processedColumns.map((col) => {
      const sum = item.sums.find((s) => s.mappedField === col.mappedField);
      const isFirstCol = item.columns.findIndex((c) => c.id === col.id) === 0;

      let value = "";
      let name = `TextBox_SUM_EMPTY_${col.id}`;

      if (sum) {
        value = `=Sum(Fields!${sum.mappedField}.Value)`;
        name = `TextBox_SUM_${sum.id}`;
      } else if (isFirstCol) {
        value = "TOPLAM";
      }

      return {
        TablixCell: {
          CellContents: {
            Textbox: {
              "@_Name": name,
              Left: "0in",
              Top: "0in",
              Height: "18pt",
              Width: `${col.width}pt`,
              Style: {
                FontSize: "10.00003pt",
                VerticalAlign: "Middle",
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
                      Value: value,
                      Style: {
                        FontFamily: "Trebuchet MS",
                        FontSize: "6.75002pt",
                        FontWeight: "Bold",
                        Color: "black",
                      },
                    },
                  },
                  Style: { FontSize: "10.00003pt", TextAlign: "Left" },
                },
              },
            },
            ColSpan: 1,
            RowSpan: 1,
          },
        },
      };
    });
  }

  const tablixRows = [
    {
      TablixRow: {
        Height: "18.6pt",
        TablixCells: { TablixCell: headerCells.map((c) => c.TablixCell) },
      },
    },
    {
      TablixRow: {
        Height: "18.6pt",
        TablixCells: { TablixCell: dataCells.map((c) => c.TablixCell) },
      },
    },
  ];

  if (sumCells) {
    tablixRows.push({
      TablixRow: {
        Height: "18pt",
        TablixCells: { TablixCell: sumCells.map((c) => c.TablixCell) },
      },
    });
  }

  return {
    Tablix: {
      "@_Name": `Tablix_${item.id}`,
      Left: "0pt",
      Top: `${Layout.TITLE_HEIGHT}pt`,
      Height: "37.50011pt",
      Width: "504.0004pt",
      Style: { Border: { Style: "None" } },
      DataSetName: `DataSet_${item.dataSourceId}`,
      TablixBody: {
        TablixColumns: {
          TablixColumn: tablixColumns.map((c) => c.TablixColumn),
        },
        TablixRows: { TablixRow: tablixRows.map((r) => r.TablixRow) },
      },
      TablixColumnHierarchy: {
        TablixMembers: {
          TablixMember: processedColumns.map(() => ({})), 
        },
      },
      TablixRowHierarchy: buildTableHierarchy(item.groups, item.sums),
    },
  };
};

export { buildTable };
