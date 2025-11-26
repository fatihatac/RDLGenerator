//import { escapeXml } from "./escapeXml.js";
import convertTitleCase from "./convertTitleCase.js";
import * as Layout from "../constants/layoutConstants.js";
import { calculateReportValues } from "./reportCalculations.js";
import { XMLBuilder } from "fast-xml-parser";


/**
 * Başlık (Title) Textbox nesnesini oluşturur.
 */
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

/**
 * Tarih Aralığı (DateRange) Textbox nesnesini oluşturur.
 */
const buildDateRange = (item, totalWidth) => {
  const valueExpr = `=First(Fields!${item.mappedField}.Value)`;
  return {
    Textbox: {
      "@_Name": `DateRange_${item.id}`,
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

/**
 * Tablo (Tablix) hiyerarşisini (Gruplama ve Detaylar) oluşturur.
 * Recursive yapı sayesinde sınırsız iç içe grup desteklenir.
 * Başlık (Header), Veri (Data) ve Toplam (Sum) hiyerarşileri ayrı ayrı oluşturulur.
 */
const buildTablixHierarchy = (groups, sums) => {
  // Eğer hiç grup yoksa (Düz Tablo)
  if (!groups || groups.length === 0) {
    const members = [
      { TablixMember: { KeepWithGroup: "After" } }, // Header Row
      { TablixMember: { Group: { "@_Name": "Details" } } }, // Details Row
    ];

    if (sums && sums.length > 0) {
      members.push({ TablixMember: { KeepWithGroup: "Before" } }); // Sum Row
    }

    return {
      TablixMembers: {
        TablixMember: members.map((m) => m.TablixMember),
      },
    };
  }

  // --- 1. HEADER HIERARCHY (Grup sütun başlıklarını oluşturur) ---
  const createHeaderHierarchy = (index) => {
    // Base Case: Gruplar bitti, Body Header'a bağlanıyoruz
    if (index >= groups.length) {
      return {
        TablixMember: { KeepWithGroup: "After" },
      };
    }

    const group = groups[index];

    return {
      TablixMember: {
        TablixHeader: {
          Size: "72pt",
          CellContents: {
            Textbox: {
              "@_Name": `GroupHeaderLabel_${group.id || index}`,
              Left: "0in",
              Top: "0in",
              Height: "18.6pt",
              Width: "72pt",
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
                      Value: convertTitleCase(
                        group.name || `Grup ${index + 1}`
                      ),
                      Style: {
                        FontFamily: Layout.FONT_FAMILY,
                        FontSize: `${Layout.COLUMN_DATA_FONT_SIZE}pt`,
                        FontWeight: "Bold",
                        Color: "black",
                      },
                    },
                  },
                  Style: { TextAlign: "Left" },
                },
              },
              UserSort: {
                SortExpression: `=Fields!${group.mappedField}.Value`,
                SortExpressionScope: group.name || `Grup ${index + 1}` // DataHierarchy'deki grup ismini hedef gösteriyoruz
              }
            },
          },
        },
        TablixMembers: createHeaderHierarchy(index + 1), // Bir sonraki seviye
        KeepWithGroup: "After",
      },
    };
  };

  // --- 2. DATA HIERARCHY (Gerçek grup verilerini ve detayları oluşturur) ---
  const createDataHierarchy = (index) => {
    // Base Case: Gruplar bitti, Details Row'a bağlanıyoruz
    if (index >= groups.length) {
      return {
        TablixMember: {
          Group: { "@_Name": "Details" },
          // UserSort vs eklenebilir
        },
      };
    }

    const group = groups[index];
    const groupNameBase = group.name
      ? group.name.replace(/\s+/g, "")
      : `Group${index}`;
    const uniqueGroupName = `Group_${groupNameBase}_${group.id || index}`;

    return {
      TablixMember: {
        Group: {
          "@_Name": uniqueGroupName,
          GroupExpressions: {
            GroupExpression: `=Fields!${group.mappedField}.Value`,
          },
        },
        SortExpressions: {
          SortExpression: {
            Value: `=Fields!${group.mappedField}.Value`,
          },
        },
        TablixHeader: {
          Size: "72pt",
          CellContents: {
            Textbox: {
              "@_Name": `GroupHeaderValue_${uniqueGroupName}`,
              Left: "0in",
              Top: "0in",
              Height: "18.6pt",
              Width: "72pt",
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
                      Value: `=Fields!${group.mappedField}.Value`,
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
          },
        },
        TablixMembers: createDataHierarchy(index + 1), // Bir sonraki seviye
      },
    };
  };

  // --- 3. SUM HIERARCHY (Dip toplam satırı varsa) ---
  const createSumHierarchy = (index) => {
    if (index >= groups.length) {
      return {
        TablixMember: { KeepWithGroup: "Before" },
      };
    }

    return {
      TablixMember: {
        TablixHeader: {
          Size: "72pt",
          CellContents: {
            Textbox: {
              "@_Name": `GroupFooterLabel_${index}_${Math.random()
                .toString(36)
                .substr(2, 5)}`,
              Left: "0in",
              Top: "0in",
              Height: "18pt",
              Width: "72pt",
              Style: {
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
                      // İlk sütuna "TOPLAM" yaz, diğerleri boş
                      Value: "",
                      Style: {
                        FontFamily: Layout.FONT_FAMILY,
                        FontSize: "10pt",
                        FontWeight: "Bold",
                        Color: "black",
                      },
                    },
                  },
                  Style: { TextAlign: "Left" },
                },
              },
            },
          },
        },
        TablixMembers: createSumHierarchy(index + 1),
        KeepWithGroup: "Before",
      },
    };
  };

  // Hiyerarşiyi Birleştir
  // fast-xml-parser array olarak beklediği için her birini array'e atıyoruz
  const members = [];

  // 1. Header Row
  members.push(createHeaderHierarchy(0).TablixMember);

  // 2. Data Rows
  members.push(createDataHierarchy(0).TablixMember);

  // 3. Sum Row (Varsa)
  if (sums && sums.length > 0) {
    members.push(createSumHierarchy(0).TablixMember);
  }

  return {
    TablixMembers: {
      TablixMember: members,
    },
  };
};

/**
 * Tablo (Tablix) nesnesini oluşturur.
 */
const buildTablix = (item, dataSetName) => {
  const processedColumns = item.columns;

  // 1. Sütun Tanımları
  const tablixColumns = processedColumns.map((col) => ({
    TablixColumn: { Width: `${col.width}pt` },
  }));

  // 2. Header (Başlık) Hücreleri
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

  // 3. Data (Veri) Hücreleri
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

  // 4. Sum (Toplam) Hücreleri
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

  // Satırları Oluştur
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

  // Tablix Ana Objesi
  return {
    Tablix: {
      "@_Name": `Tablix_${item.id}`,
      Left: "0pt",
      Top: `${Layout.TITLE_HEIGHT}pt`,
      Height: "37.50011pt",
      Width: "504.0004pt",
      Style: { Border: { Style: "None" } },
      DataSetName: dataSetName,
      TablixBody: {
        TablixColumns: {
          TablixColumn: tablixColumns.map((c) => c.TablixColumn),
        },
        TablixRows: { TablixRow: tablixRows.map((r) => r.TablixRow) },
      },
      TablixColumnHierarchy: {
        TablixMembers: {
          TablixMember: processedColumns.map(() => ({})), // Boş TablixMember objeleri
        },
      },
      TablixRowHierarchy: buildTablixHierarchy(item.groups, item.sums),
    },
  };
};

/**
 * Veri Kaynaklarını (DataSources ve DataSets) oluşturur.
 */
const buildDataSection = (dataItem, tableItem, dataSetName) => {
  if (
    !dataItem ||
    !tableItem ||
    !dataItem.jsonKeys ||
    dataItem.jsonKeys.length === 0
  ) {
    return {};
  }

  // Fields
  const fields = dataItem.jsonKeys.map((key) => {
    const mappedColumn = tableItem.columns.find(
      (col) => col.mappedField === key
    );
    const typeName = mappedColumn ? mappedColumn.dataType : "System.String";
    return {
      Field: {
        "@_Name": key,
        DataField: key,
        "rd:TypeName": typeName,
      },
    };
  });

  // Query Columns
  const queryColumns = dataItem.jsonKeys.map((key) => ({
    Column: { "@_Name": key, "@_IsDuplicate": "False", "@_IsSelected": "True" },
  }));

  // Connection String
  const connectStringData = {
    Data: dataItem.value,
    DataMode: "inline",
    URL: "",
  };

  return {
    DataSources: {
      DataSource: {
        "@_Name": "DataSource1",
        ConnectionProperties: {
          DataProvider: "JSON",
          ConnectString: JSON.stringify(connectStringData), // Builder otomatik escape yapacaktır
        },
        "rd:ImpersonateUser": "false",
      },
    },
    DataSets: {
      DataSet: {
        "@_Name": dataSetName,
        Fields: { Field: fields.map((f) => f.Field) },
        Query: {
          DataSourceName: "DataSource1",
          CommandType: "Text",
          CommandText: '{"Name":"Result","Columns":[]}',
          QueryDesignerState: {
            "@_xmlns":
              "http://schemas.microsoft.com/ReportingServices/QueryDefinition/Relational",
            Tables: {
              Table: {
                "@_Name": "Result",
                "@_Schema": "",
                Columns: { Column: queryColumns.map((c) => c.Column) },
                SchemaLevels: {
                  SchemaInfo: { "@_Name": "Result", "@_SchemaType": "Table" },
                },
              },
            },
          },
        },
      },
    },
  };
};

// --- ANA FONKSİYON ---

function generateRDL(items) {
  const {
    dataItem,
    tableItem,
    TOTAL_REPORT_WIDTH,
    TOTAL_REPORT_HEIGHT,
    dataSetName,
  } = calculateReportValues(items);

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: "@_",
    suppressEmptyNode: true,
  });

  // Rapor Elemanlarını Oluştur (ReportItems)
  // map sonucu bir dizi dönecektir, fast-xml-parser bunu sırasıyla işler.
  const reportItemsList = items
    .map((item) => {
      if (item.type === "title") return buildTitle(item, TOTAL_REPORT_WIDTH);
      if (item.type === "table") return buildTablix(item, dataSetName);
      if (item.type === "dateRange")
        return buildDateRange(item, TOTAL_REPORT_WIDTH);
      return null;
    })
    .filter(Boolean);

  // Veri bölümünü oluştur
  const dataSection = buildDataSection(dataItem, tableItem, dataSetName);

  // Ana Rapor Objesi
  const reportObj = {
    Report: {
      "@_xmlns:df":
        "http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition/defaultfontfamily",
      "@_xmlns:rd":
        "http://schemas.microsoft.com/SQLServer/reporting/reportdesigner",
      "@_xmlns":
        "http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition",
      ReportSections: {
        ReportSection: {
          Body: {
            Style: { Border: { Style: "None" } },
            ReportItems: reportItemsList, // Dizi olarak veriyoruz, parser children olarak ekler
            Height: `${TOTAL_REPORT_HEIGHT}pt`,
          },
          Width: `${TOTAL_REPORT_WIDTH}pt`,
          Page: {
            LeftMargin: "72.00021pt",
            RightMargin: "72.00021pt",
            TopMargin: "72.00021pt",
            BottomMargin: "72.00021pt",
            Style: { Border: { Style: "None" } },
          },
        },
      },
      AutoRefresh: "0",
      ...dataSection, // DataSources ve DataSets buraya spread edilir
      ReportParametersLayout: {
        GridLayoutDefinition: {
          NumberOfColumns: "4",
          NumberOfRows: "2",
        },
      },
      "rd:ReportUnitType": "Inch",
      "rd:PageUnit": "Px",
      "df:DefaultFontFamily": Layout.FONT_FAMILY,
    },
  };

  const xmlOutput = builder.build(reportObj);

  // XML Header'ı manuel ekliyoruz (builder genelde sadece root element üretir)
  return `<?xml version="1.0"?>\n${xmlOutput}`;
}

export { generateRDL };

// import { escapeXml } from "./escapeXml.js";
// import convertTitleCase from "./convertTitleCase.js";
// import * as Layout from "../constants/layoutConstants.js";
// import { calculateReportValues } from "./reportCalculations.js";
// import { XMLBuilder } from "fast-xml-parser";
// import { buildTitle } from "./buildTitle.js";

// function generateRDL(items) {
//   const {
//     dataItem,
//     tableItem,
//     TOTAL_REPORT_WIDTH,
//     TOTAL_REPORT_HEIGHT,
//     dataSetName,
//   } = calculateReportValues(items);

//   const builder = new XMLBuilder({
//     ignoreAttributes: false,
//     format: true,
//     attributeNamePrefix: "@_",
//     suppressEmptyNode: true,
//   });

//   const itemsXml = items
//     .map((item) => {
//       if (item.type === "title") {
//         const file = builder.build(buildTitle(item,TOTAL_REPORT_WIDTH));
//         console.log(file);
//         return `<Textbox Name="Title_${item.id}">
//             <Left>0pt</Left>
//             <Top>0pt</Top>
//             <Height>${Layout.TITLE_HEIGHT}pt</Height>
//             <Width>${TOTAL_REPORT_WIDTH}pt</Width>
//             <Style>
//               <VerticalAlign>${Layout.TITLE_TEXT_VERTICAL_ALIGN}</VerticalAlign>
//               <PaddingLeft>2pt</PaddingLeft>
//               <PaddingRight>2pt</PaddingRight>
//               <PaddingTop>2pt</PaddingTop>
//               <PaddingBottom>2pt</PaddingBottom>
//               <Border>
//                 <Style>None</Style>
//               </Border>
//             </Style>
//             <CanGrow>true</CanGrow>
//             <KeepTogether>true</KeepTogether>
//             <Paragraphs>
//               <Paragraph>
//                 <TextRuns>
//                   <TextRun>
//                     <Value>${item.value.toLocaleUpperCase("tr")}</Value>
//                     <Style>
//                       <FontFamily>${Layout.FONT_FAMILY}</FontFamily>
//                       <FontSize>${Layout.TITLE_FONT_SIZE}pt</FontSize>
//                       <FontWeight>${Layout.TITLE_FONT_WEIGHT}</FontWeight>
//                       <Color>Black</Color>
//                     </Style>
//                   </TextRun>
//                 </TextRuns>
//                 <Style>
//                   <TextAlign>${Layout.TITLE_TEXT_HORIZONTAL_ALIGN}</TextAlign>
//                 </Style>
//               </Paragraph>
//             </Paragraphs>
//           </Textbox>`;
//       }

//       if (item.type === "table") {
//         const processedColumns = item.columns;
//         const columnsXml = processedColumns
//           .map(
//             (col) => `<TablixColumn>
//                   <Width>${col.width}pt</Width>
//                 </TablixColumn>`
//           )
//           .join("");

//         const headerCellsXml = processedColumns
//           .map(
//             (col, index) => `<TablixCell>
//             <CellContents>
//               <Textbox Name="Header_${item.id}_${index}">
//                           <Left>0pt</Left>
//                           <Top>0pt</Top>
//                           <Height>${Layout.COLUMN_HEIGHT}</Height>
//                           <Width>${col.width}pt</Width>
//                           <Style>
//                             <VerticalAlign>${
//                               Layout.COLUMN_TEXT_VERTICAL_ALIGN
//                             }</VerticalAlign>
//                             <PaddingLeft>2pt</PaddingLeft>
//                             <PaddingRight>2pt</PaddingRight>
//                             <PaddingTop>2pt</PaddingTop>
//                             <PaddingBottom>2pt</PaddingBottom>
//                             <Border>
//                               <Color>LightGrey</Color>
//                               <Style>Solid</Style>
//                             </Border>
//                           </Style>
//                         <CanGrow>true</CanGrow>
//                         <KeepTogether>true</KeepTogether>
//                         <Paragraphs>
//                             <Paragraph>
//                               <TextRuns>
//                                 <TextRun>
//                                   <Value>${convertTitleCase(col.name)}</Value>
//                                   <Style>
//                                     <FontFamily>${
//                                       Layout.FONT_FAMILY
//                                     }</FontFamily>
//                                     <FontSize>${
//                                       Layout.COLUMN_DATA_FONT_SIZE
//                                     }pt</FontSize>
//                                     <FontWeight>${
//                                       Layout.TITLE_FONT_WEIGHT
//                                     }</FontWeight>
//                                     <Color>black</Color>
//                                   </Style>
//                                 </TextRun>
//                               </TextRuns>
//                               <Style>
//                                 <TextAlign>${
//                                   Layout.COLUMN_TEXT_HORIZONTAL_ALIGN
//                                 }</TextAlign>
//                               </Style>
//                             </Paragraph>
//                         </Paragraphs>
//                         ${
//                           col.mappedField !== "RowNumber" &&
//                           `<UserSort>
//                                <SortExpression>=Fields!${col.mappedField}.Value</SortExpression>
//                                <SortExpressionScope>Details</SortExpressionScope>
//                             </UserSort>`
//                         }
//               </Textbox>
//                 <ColSpan>1</ColSpan>
//                 <RowSpan>1</RowSpan>
//             </CellContents>
//           </TablixCell>`
//           )
//           .join("");

//         const dataCellsXml = processedColumns
//           .map(
//             (col, index) => `<TablixCell>
//             <CellContents>
//               <Textbox Name="Data_${item.id}_${index}">
//                   <Left>0in</Left>
//                   <Top>0in</Top>
//                   <Height>18.6pt</Height>
//                   <Width>${col.width}pt</Width>
//                   <Style>
//                     <VerticalAlign>${
//                       Layout.COLUMN_TEXT_VERTICAL_ALIGN
//                     }</VerticalAlign>
//                     <PaddingLeft>2pt</PaddingLeft>
//                     <PaddingRight>2pt</PaddingRight>
//                     <PaddingTop>2pt</PaddingTop>
//                     <PaddingBottom>2pt</PaddingBottom>
//                     <Border>
//                       <Color>LightGrey</Color>
//                       <Style>Solid</Style>
//                     </Border>
//                 </Style>
//                 <CanGrow>true</CanGrow>
//                 <KeepTogether>true</KeepTogether>
//                 <Paragraphs>
//                   <Paragraph>
//                     <TextRuns>
//                       <TextRun>
//                         <Value>${
//                           col.mappedField === "RowNumber"
//                             ? "=RowNumber(nothing)"
//                             : `=Fields!${col.mappedField}.Value`
//                         }</Value>
//                         <Style>
//                            <FontFamily>${Layout.FONT_FAMILY}</FontFamily>
//                            <FontSize>6.75pt</FontSize>
//                            <Color>black</Color>
//                         </Style>
//                       </TextRun>
//                     </TextRuns>
//                     <Style>
//                       <TextAlign>${
//                         Layout.COLUMN_TEXT_HORIZONTAL_ALIGN
//                       }</TextAlign>
//                     </Style>
//                   </Paragraph>
//                 </Paragraphs>
//               </Textbox>
//               <ColSpan>1</ColSpan>
//               <RowSpan>1</RowSpan>
//             </CellContents>
//           </TablixCell>`
//           )
//           .join("");

//         const generateGroupHierarchy = (groups, sums) => {
//           let sumTablixMemberContent = "";
//           if (sums && sums.length > 0) {
//             sumTablixMemberContent = `
//               <TablixMember>
//                   <KeepWithGroup>Before</KeepWithGroup>
//               </TablixMember>`;
//           }

//           let hierarchyXml = "";
//           let detailsMember = `
//             <TablixMember>
//               <Group Name="Details" />
//             </TablixMember>
//           `;

//           if (!groups || groups.length === 0) {
//             hierarchyXml = `<TablixMembers>
//                       <TablixMember>
//                         <KeepWithGroup>After</KeepWithGroup>
//                       </TablixMember>
//                       ${detailsMember}
//                       ${sumTablixMemberContent}
//                     </TablixMembers>`;
//           } else {
//             const group = groups[0];
//             hierarchyXml = `<TablixMembers>
//                 <TablixMember>
//                   <TablixHeader>
//                     <Size>72pt</Size>
//                     <CellContents>
//                       <Textbox Name="TextBox_${group.name}">
//                         <Left>0in</Left>
//                         <Top>0in</Top>
//                         <Height>18.6pt</Height>
//                         <Width>72pt</Width>
//                         <Style>
//                           <FontSize>10.00003pt</FontSize>
//                           <VerticalAlign>Middle</VerticalAlign>
//                           <PaddingLeft>2pt</PaddingLeft>
//                           <PaddingRight>2pt</PaddingRight>
//                           <PaddingTop>2pt</PaddingTop>
//                           <PaddingBottom>2pt</PaddingBottom>
//                           <Border>
//                             <Color>LightGrey</Color>
//                             <Style>Solid</Style>
//                           </Border>
//                         </Style>
//                         <CanGrow>true</CanGrow>
//                         <KeepTogether>true</KeepTogether>
//                         <Paragraphs>
//                           <Paragraph>
//                             <TextRuns>
//                               <TextRun>
//                                 <Value>${group.name}</Value>
//                                 <Style>
//                                   <FontFamily>Trebuchet MS</FontFamily>
//                                   <FontSize>7.50003pt</FontSize>
//                                   <FontWeight>Bold</FontWeight>
//                                   <Color>black</Color>
//                                 </Style>
//                               </TextRun>
//                             </TextRuns>
//                             <Style>
//                               <FontSize>10.00003pt</FontSize>
//                               <TextAlign>Left</TextAlign>
//                             </Style>
//                           </Paragraph>
//                         </Paragraphs>
//                       </Textbox>
//                     </CellContents>
//                   </TablixHeader>
//                   <TablixMembers>
//                     <TablixMember />
//                   </TablixMembers>
//                   <KeepWithGroup>After</KeepWithGroup>
//                 </TablixMember>
//                 <TablixMember>
//                   <Group Name="sicilId1">
//                     <GroupExpressions>
//                       <GroupExpression>=Fields!${group.mappedField}.Value</GroupExpression>
//                     </GroupExpressions>
//                   </Group>
//                   <SortExpressions>
//                     <SortExpression>
//                       <Value>=Fields!${group.mappedField}.Value</Value>
//                     </SortExpression>
//                   </SortExpressions>
//                   <TablixHeader>
//                     <Size>72pt</Size>
//                     <CellContents>
//                       <Textbox Name="${group.mappedField}">
//                         <Left>0in</Left>
//                         <Top>0in</Top>
//                         <Height>18.6pt</Height>
//                         <Width>72pt</Width>
//                         <Style>
//                           <FontSize>10.00003pt</FontSize>
//                           <VerticalAlign>Middle</VerticalAlign>
//                           <PaddingLeft>2pt</PaddingLeft>
//                           <PaddingRight>2pt</PaddingRight>
//                           <PaddingTop>2pt</PaddingTop>
//                           <PaddingBottom>2pt</PaddingBottom>
//                           <Border>
//                             <Color>LightGrey</Color>
//                             <Style>Solid</Style>
//                           </Border>
//                         </Style>
//                         <CanGrow>true</CanGrow>
//                         <KeepTogether>true</KeepTogether>
//                         <Paragraphs>
//                           <Paragraph>
//                             <TextRuns>
//                               <TextRun>
//                                 <Value>=Fields!${group.mappedField}.Value</Value>
//                                 <Style>
//                                   <FontFamily>Trebuchet MS</FontFamily>
//                                   <FontSize>6.75002pt</FontSize>
//                                   <Color>black</Color>
//                                 </Style>
//                               </TextRun>
//                             </TextRuns>
//                             <Style>
//                               <FontSize>10.00003pt</FontSize>
//                               <TextAlign>Left</TextAlign>
//                             </Style>
//                           </Paragraph>
//                         </Paragraphs>
//                       </Textbox>
//                     </CellContents>
//                   </TablixHeader>
//                   <TablixMembers>
//                     ${detailsMember}
//                     ${sumTablixMemberContent}
//                   </TablixMembers>
//                 </TablixMember>
//               </TablixMembers>`;
//           }

//           return hierarchyXml;
//         };

//         return `<Tablix Name="Tablix_${item.id}">
//             <Left>0pt</Left>
//             <Top>${Layout.TITLE_HEIGHT}pt</Top>
//             <Height>37.50011pt</Height>
//             <Width>504.0004pt</Width>
//             <Style>
//               <Border>
//                 <Style>None</Style>
//               </Border>
//             </Style>
//             <DataSetName>${dataSetName}</DataSetName>
//           <TablixBody>
//             <TablixColumns>
//               ${columnsXml}
//             </TablixColumns>
//             <TablixRows>
//               <TablixRow>
//                 <Height>18.6pt</Height>
//                 <TablixCells>
//                   ${headerCellsXml}
//                 </TablixCells>
//               </TablixRow>
//               <TablixRow>
//                 <Height>18.6pt</Height>
//                 <TablixCells>
//                   ${dataCellsXml}
//                 </TablixCells>
//               </TablixRow>
//               ${
//                 item.sums && item.sums.length > 0
//                   ? `
//               <TablixRow>
//                   <Height>18pt</Height>
//                   <TablixCells>
//                   ${item.columns
//                     .map((col) => {
//                       const sum = item.sums.find(
//                         (s) => s.mappedField === col.mappedField
//                       );
//                       if (sum) {
//                         return `
//                         <TablixCell>
//                           <CellContents>
//                             <Textbox Name="TextBox_SUM_${sum.id}">
//                               <Left>0in</Left>
//                               <Top>0in</Top>
//                               <Height>18pt</Height>
//                               <Width>${col.width}pt</Width>
//                               <Style>
//                                 <FontSize>10.00003pt</FontSize>
//                                 <VerticalAlign>Middle</VerticalAlign>
//                                 <PaddingLeft>2pt</PaddingLeft>
//                                 <PaddingRight>2pt</PaddingRight>
//                                 <PaddingTop>2pt</PaddingTop>
//                                 <PaddingBottom>2pt</PaddingBottom>
//                                 <Border>
//                                   <Color>LightGrey</Color>
//                                   <Style>Solid</Style>
//                                 </Border>
//                               </Style>
//                               <CanGrow>true</CanGrow>
//                               <KeepTogether>true</KeepTogether>
//                               <Paragraphs>
//                                 <Paragraph>
//                                   <TextRuns>
//                                     <TextRun>
//                                       <Value>=Sum(Fields!${sum.mappedField}.Value)</Value>
//                                       <Style>
//                                         <FontFamily>Trebuchet MS</FontFamily>
//                                         <FontSize>6.75002pt</FontSize>
//                                         <Color>black</Color>
//                                       </Style>
//                                     </TextRun>
//                                   </TextRuns>
//                                   <Style>
//                                     <FontSize>10.00003pt</FontSize>
//                                     <TextAlign>Left</TextAlign>
//                                   </Style>
//                                 </Paragraph>
//                               </Paragraphs>
//                             </Textbox>
//                             <ColSpan>1</ColSpan>
//                             <RowSpan>1</RowSpan>
//                           </CellContents>
//                         </TablixCell>
//                       `;
//                       } else {
//                         return `
//                         <TablixCell>
//                           <CellContents>
//                             <Textbox Name="TextBox_SUM_EMPTY_${col.id}">
//                               <Left>0in</Left>
//                               <Top>0in</Top>
//                               <Height>18pt</Height>
//                               <Width>${col.width}pt</Width>
//                               <Style>
//                                 <FontSize>10.00003pt</FontSize>
//                                 <VerticalAlign>Middle</VerticalAlign>
//                                 <PaddingLeft>2pt</PaddingLeft>
//                                 <PaddingRight>2pt</PaddingRight>
//                                 <PaddingTop>2pt</PaddingTop>
//                                 <PaddingBottom>2pt</PaddingBottom>
//                                 <Border>
//                                   <Color>LightGrey</Color>
//                                   <Style>Solid</Style>
//                                 </Border>
//                               </Style>
//                               <CanGrow>true</CanGrow>
//                               <KeepTogether>true</KeepTogether>
//                               <Paragraphs>
//                                 <Paragraph>
//                                   <TextRuns>
//                                     <TextRun>
//                                       <Value>${
//                                         item.columns.findIndex(
//                                           (c) => c.id === col.id
//                                         ) === 0
//                                           ? "TOPLAM"
//                                           : ""
//                                       }</Value>
//                                       <Style>
//                                         <FontFamily>Trebuchet MS</FontFamily>
//                                         <FontSize>6.75002pt</FontSize>
//                                         <Color>black</Color>
//                                       </Style>
//                                     </TextRun>
//                                   </TextRuns>
//                                   <Style>
//                                     <FontSize>10.00003pt</FontSize>
//                                     <TextAlign>Left</TextAlign>
//                                   </Style>
//                                 </Paragraph>
//                               </Paragraphs>
//                             </Textbox>
//                             <ColSpan>1</ColSpan>
//                             <RowSpan>1</RowSpan>
//                           </CellContents>
//                         </TablixCell>
//                       `;
//                       }
//                     })
//                     .join("")}
//                   </TablixCells>
//                 </TablixRow>
//               `
//                   : ""
//               }
//             </TablixRows>
//           </TablixBody>
//           <TablixColumnHierarchy>
//             <TablixMembers>
//               ${processedColumns.map(() => "<TablixMember />").join("")}
//             </TablixMembers>
//           </TablixColumnHierarchy>
//           <TablixRowHierarchy>
//             ${generateGroupHierarchy(item.groups, item.sums)}
//           </TablixRowHierarchy>
//         </Tablix>`;
//       }
//       if (item.type === "dateRange") {
//         const valueExpr = `=First(Fields!${escapeXml(item.mappedField)}.Value)`;

//         return `<Textbox Name="DateRange_${item.id}">
//             <Left>0pt</Left>
//             <Top>0pt</Top>
//             <Height>${Layout.TITLE_HEIGHT}pt</Height>
//             <Width>${TOTAL_REPORT_WIDTH}pt</Width>
//             <Style>
//               <VerticalAlign>Middle</VerticalAlign>
//               <PaddingLeft>2pt</PaddingLeft>
//               <PaddingRight>2pt</PaddingRight>
//               <PaddingTop>2pt</PaddingTop>
//               <PaddingBottom>2pt</PaddingBottom>
//               <Border>
//                 <Style>None</Style>
//               </Border>
//               </Style>
//               <CanGrow>true</CanGrow>
//               <KeepTogether>true</KeepTogether>
//               <Paragraphs>
//                 <Paragraph>
//                   <TextRuns>
//                     <TextRun>
//                       <Value>${valueExpr}</Value>
//                       <Style>
//                         <FontFamily>${Layout.FONT_FAMILY}</FontFamily>
//                         <FontSize>${Layout.TITLE_FONT_SIZE - 1}pt</FontSize>
//                         <Color>Black</Color>
//                       </Style>
//                     </TextRun>
//                   </TextRuns>
//                   <Style>
//                     <TextAlign>Left</TextAlign>
//                   </Style>
//                   </Paragraph>
//                 </Paragraphs>
//               </Textbox>`;
//       }
//       return "";
//     })
//     .join("\n");

//   let dataXml = "";

//   if (
//     dataItem &&
//     tableItem &&
//     dataItem.jsonKeys &&
//     dataItem.jsonKeys.length > 0
//   ) {
//     const fieldsXml = dataItem.jsonKeys
//       .map((key) => {
//         const mappedColumn = tableItem.columns.find(
//           (col) => col.mappedField === key
//         );
//         const typeName = mappedColumn ? mappedColumn.dataType : "System.String";

//         return `<Field Name="${key}">
//         <DataField>${key}</DataField>
//         <rd:TypeName>${typeName}</rd:TypeName>
//       </Field>`;
//       })
//       .join("\n");

//     const connectStringData = {
//       Data: dataItem.value,
//       DataMode: "inline",
//       URL: "",
//     };

//     const connectStringContent = JSON.stringify(connectStringData);

//     const dataSourceXml = `<DataSources>
//       <DataSource Name="DataSource1">
//         <ConnectionProperties>
//           <DataProvider>JSON</DataProvider>
//           <ConnectString>${escapeXml(connectStringContent)}</ConnectString>
//         </ConnectionProperties>
//         <rd:ImpersonateUser>false</rd:ImpersonateUser>
//       </DataSource>
//     </DataSources>`;

//     const queryDesignerColumnsXml = dataItem.jsonKeys
//       .map(
//         (key) => `
//                 <Column Name="${key}" IsDuplicate="False" IsSelected="True" />`
//       )
//       .join("\n");

//     const dataSetXml = `<DataSets>
//       <DataSet Name="${dataSetName}">
//         <Fields>
//           ${fieldsXml}
//         </Fields>
//         <Query>
//           <DataSourceName>DataSource1</DataSourceName>
//           <CommandType>Text</CommandType>
//           <CommandText>{"Name":"Result","Columns":[]}</CommandText>
//           <QueryDesignerState xmlns="http://schemas.microsoft.com/ReportingServices/QueryDefinition/Relational">
//             <Tables>
//               <Table Name="Result" Schema="">
//                 <Columns>
//                   ${queryDesignerColumnsXml}
//                 </Columns>
//                 <SchemaLevels>
//                   <SchemaInfo Name="Result" SchemaType="Table" />
//                 </SchemaLevels>
//               </Table>
//             </Tables>
//           </QueryDesignerState>
//         </Query>
//       </DataSet>
//     </DataSets>`;

//     dataXml = `${dataSourceXml}\n${dataSetXml}`;
//   }

//   return `<?xml version="1.0"?>
// <Report xmlns:df="http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition/defaultfontfamily" xmlns:rd="http://schemas.microsoft.com/SQLServer/reporting/reportdesigner" xmlns="http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition">
//   <ReportSections>
//     <ReportSection>
//       <Body>
//         <Style>
//           <Border>
//             <Style>None</Style>
//           </Border>
//         </Style>
//         <ReportItems>
//           ${itemsXml}
//         </ReportItems>
//         <Height>${TOTAL_REPORT_HEIGHT}pt</Height>
//       </Body>
//       <Width>${TOTAL_REPORT_WIDTH}pt</Width>
//       <Page>
//         <LeftMargin>72.00021pt</LeftMargin>
//         <RightMargin>72.00021pt</RightMargin>
//         <TopMargin>72.00021pt</TopMargin>
//         <BottomMargin>72.00021pt</BottomMargin>
//         <Style>
//           <Border>
//             <Style>None</Style>
//           </Border>
//         </Style>
//       </Page>
//     </ReportSection>
//   </ReportSections>
//   <AutoRefresh>0</AutoRefresh>
//   ${dataXml}
//   <ReportParametersLayout>
//     <GridLayoutDefinition>
//       <NumberOfColumns>4</NumberOfColumns>
//       <NumberOfRows>2</NumberOfRows>
//     </GridLayoutDefinition>
//   </ReportParametersLayout>
//   <rd:ReportUnitType>Inch</rd:ReportUnitType>
//   <rd:PageUnit>Px</rd:PageUnit>
//   <df:DefaultFontFamily>${Layout.FONT_FAMILY}</df:DefaultFontFamily>
// </Report>`;
// }

// export { generateRDL };

// import { XMLBuilder } from "fast-xml-parser";
// import { buildReportItems } from "./buildItems.js";
// import { buildDataSources } from "./buildDataSources.js";
// import { buildDataSet } from "./buildDataset.js";
// import { calculateReportValues } from "./reportCalculations.js";
// import * as Layout from "../constants/layoutConstants.js";

// function generateRDL(items) {
//   const builder = new XMLBuilder({
//     ignoreAttributes: false,
//     format: true,
//     attributeNamePrefix: "@_",
//     suppressEmptyNode: true,
//   });

//   const {
//     dataItem,
//     tableItem,
//     TOTAL_REPORT_WIDTH,
//     TOTAL_REPORT_HEIGHT,
//     dataSetName,
//   } = calculateReportValues(items);

//   console.log(buildReportItems(items, { TOTAL_REPORT_WIDTH }));

//   const reportObj = {
//     Report: {
//       "@_xmlns:df":
//         "http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition/defaultfontfamily",
//       "@_xmlns:rd":
//         "http://schemas.microsoft.com/SQLServer/reporting/reportdesigner",
//       "@_xmlns":
//         "http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition",

//       ReportSections: {
//         ReportSection: {
//           Body: {
//             Style: { Border: { Style: "None" } },
//             ReportItems: [buildReportItems(items, { TOTAL_REPORT_WIDTH })],
//             Height: `${TOTAL_REPORT_HEIGHT}pt`,
//           },
//           Width: `${TOTAL_REPORT_WIDTH}pt`,
//           Page: {
//             LeftMargin: "72pt",
//             RightMargin: "72pt",
//             TopMargin: "72pt",
//             BottomMargin: "72pt",
//             Style: { Border: { Style: "None" } },
//           },
//         },
//       },

//       AutoRefresh: 0,

//       ...(dataItem
//         ? {
//             //DataSources: buildDataSources(dataItem),
//             DataSets: buildDataSet(dataItem, tableItem, "Dataset1"),
//           }
//         : {}),

//       ReportParametersLayout: {
//         GridLayoutDefinition: {
//           NumberOfColumns: 4,
//           NumberOfRows: 2,
//         },
//       },

//       "rd:ReportUnitType": "Inch",
//       "rd:PageUnit": "Px",
//       "df:DefaultFontFamily": Layout.FONT_FAMILY,
//     },
//   };
//     const xmlOutput = builder.build(reportObj)
//   return `<?xml version="1.0"?>\n${xmlOutput}`;;
// }

// export { generateRDL };
