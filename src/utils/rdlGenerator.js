import * as Layout from "../constants/layoutConstants.js";
import { calculateReportValues } from "./reportCalculations.js";
import { XMLBuilder } from "fast-xml-parser";
import buildDataSection from "./buildDataSection.js";
import { buildReportItems } from "./buildItems.js";

function generateRDL(items) {
  const {
    TOTAL_REPORT_WIDTH,
    TOTAL_REPORT_HEIGHT,
  } = calculateReportValues(items);

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: "@_",
    suppressEmptyNode: true,
  });

  const reportItemsList = buildReportItems(items, TOTAL_REPORT_WIDTH)

  const allDataItems = items.filter(item => item.type === "data");
  let allDataSources = [];
  let allDataSets = [];

  allDataItems.forEach(dataItem => {
    const currentDataSetName = `DataSet_${dataItem.id}`;
    const { DataSources, DataSets } = buildDataSection(dataItem, currentDataSetName);
    
    if (DataSources && DataSources.DataSource) {
      allDataSources.push(DataSources.DataSource);
    }
    if (DataSets && DataSets.DataSet) {
      allDataSets.push(DataSets.DataSet);
    }
  });

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
            ReportItems: reportItemsList,
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
      ...(allDataSources.length > 0 && { DataSources: { DataSource: allDataSources } }),
      ...(allDataSets.length > 0 && { DataSets: { DataSet: allDataSets } }),
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
