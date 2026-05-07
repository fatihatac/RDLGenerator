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

  const tablixColumns = [
    ...rowGroups.map(rg => ({ TablixColumn: { Width: `${rg.width || settings.columnWidth}pt` } })),
    ...columnGroups.map(cg => ({ TablixColumn: { Width: `${cg.width || settings.columnWidth}pt` } })),
    ...staticColumns.map(sc => ({ TablixColumn: { Width: `${sc.width || settings.columnWidth}pt` } })),
  ];

  const buildCornerCells = () => {
    const cells = [];
    rowGroups.forEach((rg, index) => {
      cells.push({
        TablixCell: {
          CellContents: {
            Textbox: {
              '@_Name': `CornerCell_${item.id}_${index}`,
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
          },
        },
      });
    });
    return { TablixCornerRows: { TablixCornerRow: { TablixCornerCell: cells } } };
  };

  const buildColumnHierarchy = () => {
    const members = [];

    columnGroups.forEach((cg, index) => {
      members.push({
        TablixMember: {
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
        },
      });
    });

    staticColumns.forEach((sc, index) => {
      members.push({
        TablixMember: {
          TablixHeader: {
            Size: `${sc.width || settings.columnWidth}pt`,
            CellContents: {
              Textbox: {
                '@_Name': `StaticCol_${index}`,
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
        },
      });
    });

    return { TablixMembers: { TablixMember: members } };
  };

  const buildRowHierarchy = () => {
    const createRowMember = (index) => {
      if (index >= rowGroups.length) {
        return { TablixMember: { Group: { '@_Name': 'Details' } } };
      }
      const rg = rowGroups[index];
      return {
        TablixMember: {
          Group: {
            '@_Name': `RowGroup_${index}`,
            GroupExpressions: { GroupExpression: `=Fields!${rg.mappedField}.Value` },
          },
          SortExpressions: { SortExpression: { Value: `=Fields!${rg.mappedField}.Value` } },
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
                        Value: `=Fields!${rg.mappedField}.Value`,
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
  //               BackgroundColor: resolveValue(item, 'backgroundColor'),
  //             },
  //             Paragraphs: {
  //               Paragraph: {
  //                 TextRuns: {
  //                   TextRun: {
  //                     Value: resolveValue(item, 'valueExpr') || `=Fields!${colCfg?.mappedField}.Value`,
  //                     Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnDataFontSize}pt` },
  //                   },
  //                 },
  //                 Style: { TextAlign: 'Center' },
  //               },
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
    const totalCols = columnGroups.length + staticColumns.length;
    for (let i = 0; i < totalCols; i++) {
      const isStatic = i >= columnGroups.length;
      const colCfg = isStatic ? staticColumns[i - columnGroups.length] : columnGroups[i];
      
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
                // DÜZELTME BURADA: item yerine colCfg içinden arıyoruz
                BackgroundColor: resolveValue(colCfg, 'backgroundColor') || resolveValue(item, 'backgroundColor'),
              },
              Paragraphs: {
                Paragraph: {
                  TextRuns: {
                    TextRun: {
                      // DÜZELTME BURADA: item.valueExpr yerine colCfg.valueExpr'e öncelik veriyoruz
                      Value: resolveValue(colCfg, 'valueExpr') || resolveValue(item, 'valueExpr') || `=Fields!${colCfg?.mappedField}.Value`,
                      Style: { FontFamily: settings.fontFamily, FontSize: `${settings.columnDataFontSize}pt` },
                    },
                  },
                  Style: { TextAlign: 'Center' },
                },
              },
            },
          },
        },
      });
    }
    return { TablixRow: { Height: `${colH}pt`, TablixCells: { TablixCell: cells } } };
  };
  return {
    Tablix: {
      '@_Name': `TablixMatrix_${item.id}`,
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
