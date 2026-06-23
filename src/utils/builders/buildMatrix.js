import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';
import convertTitleCase from '../helpers/convertTitleCase.js';
import { escapeXml } from '../helpers/escapeXml.js';

const resolveValue = (item, property) => {
  if (item && item.expressionValue) return item.expressionValue;
  return item[property] || '';
};

const buildMatrix = (item, dataSetMap, settings = DEFAULT_LAYOUT_SETTINGS) => {
  const rowGroups = item.rowGroups || [];
  const columnGroups = item.columnGroups || [];
  const staticColumns = item.staticColumns || [];
  const colH = settings.columnHeight;

  const tablixColumns = staticColumns.map(sc => ({ TablixColumn: { Width: `${sc.width || settings.columnWidth}pt` } }));

  const buildCornerCells = () => {
    return {
      TablixCornerRows: {
        TablixCornerRow: {
          TablixCornerCell: rowGroups.map((rg, ri) => ({
            TablixCell: {
              CellContents: {
                Textbox: {
                  '@_Name': `CornerCell_${item.id}_${ri}`,
                  Height: `${colH}pt`,
                  Width: `${rg.width || settings.columnWidth}pt`,
                  Style: {
                    VerticalAlign: settings.columnVAlign,
                    Border: { Color: 'LightGrey', Style: 'Solid' },
                    BackgroundColor: resolveValue(rg, 'backgroundColor'),
                  },
                  Paragraphs: {
                    Paragraph: {
                      TextRuns: {
                        TextRun: {
                          Value: escapeXml(convertTitleCase(rg.name)),
                          Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnHeaderFontSize}pt`, FontWeight: 'Bold' },
                        },
                      },
                      Style: { TextAlign: 'Left' },
                    },
                  },
                },
                ColSpan: 1,
                RowSpan: 1,
              },
            },
          })),
        },
      },
    };
  };

  const buildColumnHierarchy = () => {
    const buildStaticMembers = () =>
      staticColumns.map((sc, scIndex) => ({
        TablixHeader: {
          Size: `${sc.width || settings.columnWidth}pt`,
          CellContents: {
            Textbox: {
              '@_Name': `StaticCol_${scIndex}`,
              Height: `${colH}pt`,
              Width: `${sc.width || settings.columnWidth}pt`,
              Style: { VerticalAlign: settings.columnVAlign, Border: { Color: 'LightGrey', Style: 'Solid' } },
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: escapeXml(sc.name),
                      Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnHeaderFontSize}pt` },
                    },
                  },
                  Style: { TextAlign: 'Center' },
                },
              },
            },
          },
        },
      }));

    const staticMembers = buildStaticMembers();

    if (columnGroups.length > 0) {
      return {
        TablixMembers: {
          TablixMember: [
            ...columnGroups.map((cg, index) => ({
              Group: {
                '@_Name': `ColGroup_${index}`,
                GroupExpressions: { GroupExpression: `=Fields!${cg.mappedField}.Value` },
              },
              SortExpressions: { SortExpression: { Value: `=Fields!${cg.mappedField}.Value` } },
              TablixHeader: {
                Size: `${cg.width || settings.columnWidth}pt`,
                CellContents: {
                  Textbox: {
                    '@_Name': `ColHeader_${index}`,
                    Height: `${colH}pt`,
                    Width: `${cg.width || settings.columnWidth}pt`,
                    Style: { VerticalAlign: settings.columnVAlign, Border: { Color: 'LightGrey', Style: 'Solid' } },
                    Paragraphs: {
                      Paragraph: {
                        TextRuns: {
                          TextRun: {
                            Value: `=Fields!${cg.mappedField}.Value`,
                            Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnHeaderFontSize}pt` },
                          },
                        },
                        Style: { TextAlign: 'Center' },
                      },
                    },
                  },
                },
              },
            })),
            ...staticMembers,
          ],
        },
      };
    }

    return { TablixMembers: { TablixMember: staticMembers } };
  };

  const buildRowHierarchy = () => {
    const createRowMember = (index) => {
      if (index >= rowGroups.length) {
        return { TablixMember: {} };
      }
      const rg = rowGroups[index];
      const groupObj = { '@_Name': rg.mappedField ? `RowGroup_${index}` : `RowGroup_${index}_Static` };
      if (rg.mappedField) {
        groupObj.GroupExpressions = { GroupExpression: `=Fields!${rg.mappedField}.Value` };
      }
      return {
        TablixMember: {
          ...(rg.mappedField ? { Group: groupObj } : {}),
          ...(rg.mappedField ? { SortExpressions: { SortExpression: { Value: `=Fields!${rg.mappedField}.Value` } } } : {}),
          TablixHeader: {
            Size: `${rg.width || settings.columnWidth}pt`,
            CellContents: {
              Textbox: {
                '@_Name': `RowHeader_${index}`,
                Height: `${colH}pt`,
                Width: `${rg.width || settings.columnWidth}pt`,
                Style: { VerticalAlign: settings.columnVAlign, Border: { Color: 'LightGrey', Style: 'Solid' } },
                Paragraphs: {
                  Paragraph: {
                    TextRuns: {
                      TextRun: {
                        Value: rg.mappedField ? `=Fields!${rg.mappedField}.Value` : escapeXml(convertTitleCase(rg.name)),
                        Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnDataFontSize}pt` },
                      },
                    },
                    Style: { TextAlign: 'Left' },
                  },
                },
              },
            },
          },
          TablixMembers: createRowMember(index + 1),
        },
      };
    };
    return { TablixMembers: { TablixMember: createRowMember(0).TablixMember } };
  };

  // const buildBodyCells = () => {
  //   const cells = [];
  //   const totalCols = columnGroups.length + staticColumns.length;
  //   for (let i = 0; i < totalCols; i++) {
  //     const isStatic = i >= columnGroups.length;
  //     const colCfg = isStatic ? staticColumns[i - columnGroups.length] : columnGroups[i];
  //     
  //     cells.push({
  //       TablixCell: {
  //         CellContents: {
  //           Textbox: {
  //             '@_Name': `DataCell_${item.id}_${i}`,
  //             Height: `${colH}pt`,
  //             Width: `${colCfg?.width || settings.columnWidth}pt`,
  //             Style: {
  //               VerticalAlign: settings.columnVAlign,
  //               Border: { Color: 'LightGrey', Style: 'Solid' },
  //               BackgroundColor: resolveValue(item, 'backgroundColo
  //           },
  //           Paragraphs: {
  //             Paragraph: {
  //               TextRuns: {
  //                 TextRun: {
  //                   Value: resolveValue(item, 'valueExpr') || `=Fields!${colCfg?.mappedField}.Value`,
  //                   Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnDataFontSize}pt` },
  //                 },
  //               },
  //               Style: { TextAlign: 'Center' },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }
  //   return { TablixRow: { Height: `${colH}pt`, TablixCells: { TablixCell: cells } } };
  // };
  const buildBodyCells = () => {
    const cells = [];
    for (let i = 0; i < staticColumns.length; i++) {
      const colCfg = staticColumns[i];
      const bgColor = colCfg.backgroundColorExpr
        ? colCfg.backgroundColorExpr
        : (resolveValue(colCfg, 'backgroundColor') || resolveValue(item, 'backgroundColor'));
      
      cells.push({
        TablixCell: {
          CellContents: {
            Textbox: {
              '@_Name': `DataCell_${item.id}_${i}`,
              Height: `${colH}pt`,
              Width: `${colCfg?.width || settings.columnWidth}pt`,
              Style: {
                VerticalAlign: settings.columnVAlign,
                Border: { Color: 'LightGrey', Style: 'Solid' },
                BackgroundColor: bgColor,
              },
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      Value: (resolveValue(colCfg, 'valueExpr') || resolveValue(item, 'valueExpr')) || (colCfg.mappedField ? `=Fields!${colCfg.mappedField}.Value` : ''),
                      Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnDataFontSize}pt` },
                    },
                  },
                  Style: { TextAlign: 'Center' },
                },
              },
            },
            ColSpan: 1,
            RowSpan: 1,
          },
        },
      });
    }
    return { TablixRow: { Height: `${colH}pt`, TablixCells: { TablixCell: cells } } };
  };

  const matrixStaticWidth = staticColumns.reduce((s, sc) => s + (Number(sc.width) || settings.columnWidth), 0);

  return {
    Tablix: {
      '@_Name': `TablixMatrix_${item.id}`,
      Left:   `${item._left ?? 0}pt`,
      Top:    `${item._top ?? 0}pt`,
      Height: `${colH * 2}pt`,
      Width:  `${matrixStaticWidth}pt`,
      Style: { Border: { Style: 'None' } },
      DataSetName: dataSetMap ? dataSetMap[item.dataSourceId] : `DataSet_${item.dataSourceId}`,
      TablixCorner: buildCornerCells(),
      TablixBody: {
        TablixColumns: { TablixColumn: tablixColumns },
        TablixRows: { TablixRow: [buildBodyCells()] },
      },
      TablixColumnHierarchy: buildColumnHierarchy(),
      TablixRowHierarchy: buildRowHierarchy(),
    },
  };
};

export { buildMatrix };
