import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';
import convertTitleCase from '../helpers/convertTitleCase.js';

// ---------------------------------------------------------------------------
// Satır hiyerarşisi (grup + toplam) — settings bağımsız (yapısal)
// ---------------------------------------------------------------------------
const buildTableHierarchy = (groups, sums, settings) => {
  const colH = settings.columnHeight;

  if (!groups || groups.length === 0) {
    const members = [
      { TablixMember: { KeepWithGroup: 'After' } },
      { TablixMember: { Group: { '@_Name': 'Details' } } },
    ];
    if (sums?.length) members.push({ TablixMember: { KeepWithGroup: 'Before' } });
    return { TablixMembers: { TablixMember: members.map((m) => m.TablixMember) } };
  }

  const createHeaderHierarchy = (index) => {
    if (index >= groups.length) return { TablixMember: { KeepWithGroup: 'After' } };
    const group = groups[index];
    return {
      TablixMember: {
        TablixHeader: {
          Size: `${settings.columnWidth}pt`,
          CellContents: {
            Textbox: {
              '@_Name': `GroupHeaderLabel_${group.id || index}_${Math.random().toString(36)}`,
              Left:   '0in',
              Top:    '0in',
              Height: `${colH}pt`,
              Width:  `${settings.columnWidth}pt`,
              Style: {
                FontSize:      `${settings.columnHeaderFontSize}pt`,
                VerticalAlign: settings.columnVAlign,
                PaddingLeft: '2pt', PaddingRight: '2pt',
                PaddingTop:  '2pt', PaddingBottom: '2pt',
                Border: { Color: 'LightGrey', Style: 'Solid' },
              },
              CanGrow: true, KeepTogether: true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: convertTitleCase(group.name || `Grup ${index + 1}`),
                      Style: {
                        FontFamily: settings.fontFamily,
                        FontSize:   `${settings.columnDataFontSize}pt`,
                        FontWeight: 'Bold',
                        Color: 'black',
                      },
                    },
                  },
                  Style: { TextAlign: 'Left' },
                },
              },
              UserSort: {
                SortExpression:      `=Fields!${group.mappedField}.Value`,
                SortExpressionScope: `Group_${(group.name || `Group${index}`).replace(/\s+/g, '')}_${group.id || index}`,
              },
            },
          },
        },
        TablixMembers: createHeaderHierarchy(index + 1),
        KeepWithGroup: 'After',
      },
    };
  };

  const createSumHierarchy = (currentIndex, labelIndex) => {
    if (currentIndex >= groups.length) return { TablixMember: { KeepWithGroup: 'Before' } };
    const value = currentIndex === labelIndex ? 'TOPLAM' : '';
    return {
      TablixMember: {
        TablixHeader: {
          Size: `${settings.columnWidth}pt`,
          CellContents: {
            Textbox: {
              '@_Name': `GroupFooterLabel_${currentIndex}_${Math.random().toString(36)}`,
              Left: '0in', Top: '0in',
              Height: `${colH}pt`,
              Width:  `${settings.columnWidth}pt`,
              Style: {
                VerticalAlign: settings.columnVAlign,
                PaddingLeft: '2pt', PaddingRight: '2pt',
                PaddingTop:  '2pt', PaddingBottom: '2pt',
                Border: { Color: 'LightGrey', Style: 'Solid' },
              },
              CanGrow: true, KeepTogether: true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: value,
                      Style: {
                        FontFamily: settings.fontFamily,
                        FontSize:   `${settings.columnHeaderFontSize}pt`,
                        FontWeight: 'Bold',
                        Color: 'black',
                      },
                    },
                  },
                  Style: { TextAlign: 'Left' },
                },
              },
            },
          },
        },
        TablixMembers: createSumHierarchy(currentIndex + 1, labelIndex),
        KeepWithGroup: 'Before',
      },
    };
  };

  const createDataHierarchy = (index) => {
    if (index >= groups.length) return { TablixMember: { Group: { '@_Name': 'Details' } } };
    const group = groups[index];
    const groupNameBase   = group.name ? group.name.replace(/\s+/g, '') : `Group${index}`;
    const uniqueGroupName = `Group_${groupNameBase}_${group.id || index}`;
    const nextLevelMember = createDataHierarchy(index + 1);
    const innerMembers    = [nextLevelMember.TablixMember];
    if (sums?.length) innerMembers.push(createSumHierarchy(index + 1, index + 1).TablixMember);

    return {
      TablixMember: {
        Group: {
          '@_Name': uniqueGroupName,
          GroupExpressions: { GroupExpression: `=Fields!${group.mappedField}.Value` },
        },
        SortExpressions: { SortExpression: { Value: `=Fields!${group.mappedField}.Value` } },
        TablixHeader: {
          Size: `${settings.columnWidth}pt`,
          CellContents: {
            Textbox: {
              '@_Name': `GroupHeaderValue_${uniqueGroupName}`,
              Left: '0in', Top: '0in',
              Height: `${colH}pt`,
              Width:  `${settings.columnWidth}pt`,
              Style: {
                FontSize:      `${settings.columnHeaderFontSize}pt`,
                VerticalAlign: settings.columnVAlign,
                PaddingLeft: '2pt', PaddingRight: '2pt',
                PaddingTop:  '2pt', PaddingBottom: '2pt',
                Border: { Color: 'LightGrey', Style: 'Solid' },
              },
              CanGrow: true, KeepTogether: true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: `=Fields!${group.mappedField}.Value`,
                      Style: {
                        FontFamily: settings.fontFamily,
                        FontSize:   `${settings.columnDataFontSize}pt`,
                        FontWeight: 'Bold',
                        Color: 'black',
                      },
                    },
                  },
                  Style: { FontSize: `${settings.columnHeaderFontSize}pt`, TextAlign: 'Left' },
                },
              },
            },
          },
        },
        TablixMembers: { TablixMember: innerMembers },
      },
    };
  };

  return {
    TablixMembers: {
      TablixMember: [
        createHeaderHierarchy(0).TablixMember,
        createDataHierarchy(0).TablixMember,
      ],
    },
  };
};

// ---------------------------------------------------------------------------
// Ana builder
// ---------------------------------------------------------------------------
const buildTable = (item, dataSetMap, settings = DEFAULT_LAYOUT_SETTINGS) => {
  const processedColumns = item.columns;
  const colH = settings.columnHeight;

  const tablixColumns = processedColumns.map((col) => ({
    TablixColumn: { Width: `${col.width}pt` },
  }));

  // ── Header row ────────────────────────────────────────────────────────────
  const headerCells = processedColumns.map((col, index) => {
    const textbox = {
      '@_Name': `Header_${item.id}_${index}`,
      Left:   '0pt',
      Top:    '0pt',
      Height: `${colH}pt`,
      Width:  `${col.width}pt`,
      Style: {
        VerticalAlign: settings.columnVAlign,
        PaddingLeft: '2pt', PaddingRight: '2pt',
        PaddingTop:  '2pt', PaddingBottom: '2pt',
        Border: { Color: 'LightGrey', Style: 'Solid' },
      },
      CanGrow: true, KeepTogether: true,
      Paragraphs: {
        Paragraph: {
          TextRuns: {
            TextRun: {
              Value: convertTitleCase(col.name),
              Style: {
                FontFamily: settings.fontFamily,
                FontSize:   `${settings.columnHeaderFontSize}pt`,
                FontWeight: settings.titleFontWeight,
                Color: 'black',
              },
            },
          },
          Style: { TextAlign: settings.columnHAlign },
        },
      },
    };

    if (col.mappedField !== 'RowNumber') {
      textbox.UserSort = {
        SortExpression:      `=Fields!${col.mappedField}.Value`,
        SortExpressionScope: 'Details',
      };
    }

    return { TablixCell: { CellContents: { Textbox: textbox, ColSpan: 1, RowSpan: 1 } } };
  });

  // ── Data row ──────────────────────────────────────────────────────────────
  const dataCells = processedColumns.map((col, index) => {
    const valueExpr =
      col.mappedField === 'RowNumber'
        ? '=RowNumber(nothing)'
        : `=Fields!${col.mappedField}.Value`;

    return {
      TablixCell: {
        CellContents: {
          Textbox: {
            '@_Name': `Data_${item.id}_${index}`,
            Left:   '0in',
            Top:    '0in',
            Height: `${colH}pt`,
            Width:  `${col.width}pt`,
            Style: {
              VerticalAlign: settings.columnVAlign,
              PaddingLeft: '2pt', PaddingRight: '2pt',
              PaddingTop:  '2pt', PaddingBottom: '2pt',
              Border: { Color: 'LightGrey', Style: 'Solid' },
            },
            CanGrow: true, KeepTogether: true,
            Paragraphs: {
              Paragraph: {
                TextRuns: {
                  TextRun: {
                    Value: valueExpr,
                    Style: {
                      FontFamily: settings.fontFamily,
                      FontSize:   `${settings.columnDataFontSize}pt`,
                      Color: 'black',
                    },
                  },
                },
                Style: { TextAlign: settings.columnHAlign },
              },
            },
          },
          ColSpan: 1, RowSpan: 1,
        },
      },
    };
  });

  // ── Sum row ───────────────────────────────────────────────────────────────
  let sumCells = null;
  if (item.sums?.length) {
    sumCells = processedColumns.map((col) => {
      const sum      = item.sums.find((s) => s.mappedField === col.mappedField);
      const isFirst  = item.columns.findIndex((c) => c.id === col.id) === 0;
      const value    = sum ? `=Sum(Fields!${sum.mappedField}.Value)` : isFirst ? 'TOPLAM' : '';
      const name     = sum ? `TextBox_SUM_${sum.id}` : `TextBox_SUM_EMPTY_${col.id}`;

      return {
        TablixCell: {
          CellContents: {
            Textbox: {
              '@_Name': name,
              Left: '0in', Top: '0in',
              Height: `${colH}pt`,
              Width:  `${col.width}pt`,
              Style: {
                FontSize:      `${settings.columnHeaderFontSize}pt`,
                VerticalAlign: 'Middle',
                PaddingLeft: '2pt', PaddingRight: '2pt',
                PaddingTop:  '2pt', PaddingBottom: '2pt',
                Border: { Color: 'LightGrey', Style: 'Solid' },
              },
              CanGrow: true, KeepTogether: true,
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: value,
                      Style: {
                        FontFamily: settings.fontFamily,
                        FontSize:   `${settings.columnDataFontSize}pt`,
                        FontWeight: 'Bold',
                        Color: 'black',
                      },
                    },
                  },
                  Style: { FontSize: `${settings.columnHeaderFontSize}pt`, TextAlign: 'Left' },
                },
              },
            },
            ColSpan: 1, RowSpan: 1,
          },
        },
      };
    });
  }

  const tablixRows = [
    { TablixRow: { Height: `${colH}pt`, TablixCells: { TablixCell: headerCells.map((c) => c.TablixCell) } } },
    { TablixRow: { Height: `${colH}pt`, TablixCells: { TablixCell: dataCells.map((c) => c.TablixCell) } } },
  ];
  if (sumCells) {
    tablixRows.push({
      TablixRow: { Height: `${colH}pt`, TablixCells: { TablixCell: sumCells.map((c) => c.TablixCell) } },
    });
  }

  const tableWidth = processedColumns.reduce((s, c) => s + (Number(c.width) || settings.columnWidth), 0)
    + (item.groups?.length || 0) * settings.columnWidth;

  return {
    Tablix: {
      '@_Name': `Tablix_${item.id}`,
      Left:   `${item._left ?? 0}pt`,
      Top:    `${item._top ?? 0}pt`,
      Height: `${colH * (2 + (item.sums?.length ? 1 : 0))}pt`,
      Width:  `${tableWidth}pt`,
      Style: { Border: { Style: 'None' } },
      DataSetName: dataSetMap
        ? dataSetMap[item.dataSourceId]
        : `DataSet_${item.dataSourceId}`,
      TablixBody: {
        TablixColumns: { TablixColumn: tablixColumns.map((c) => c.TablixColumn) },
        TablixRows:    { TablixRow: tablixRows.map((r) => r.TablixRow) },
      },
      TablixColumnHierarchy: {
        TablixMembers: { TablixMember: processedColumns.map(() => ({})) },
      },
      TablixRowHierarchy: buildTableHierarchy(item.groups, item.sums, settings),
    },
  };
};

export { buildTable };
