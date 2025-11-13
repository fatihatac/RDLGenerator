import { escapeXml } from "./escapeXml.js";
import { getRdlTypeName } from "./getDataType.js";
import convertTitleCase from "./convertTitleCase.js";

function generateRDL(items) {
  const TITLE_HEIGHT = 49.5; //pt
  const TITLE_FONT_SIZE = 10.5; //pt
  const TITLE_FONT_WEIGHT = "Bold";
  const COLUMN_WIDTH = 72; //pt
  const COLUMN_HEIGHT = 18.6; //pt
  const COLUMN_HEADER_FONT_SIZE = 10.00003; //pt
  const COLUMN_DATA_FONT_SIZE = 7.50003; //pt
  const COLUMN_TEXT_HORIZONTAL_ALIGN = "Left";
  const COLUMN_TEXT_VERTICAL_ALIGN = "Middle";
  const TITLE_TEXT_HORIZONTAL_ALIGN = "Center";
  const TITLE_TEXT_VERTICAL_ALIGN = "Middle";
  const TABLE_HEIGHT = 37.50011; //pt
  const PAGE_HEIGHT = TITLE_HEIGHT + TABLE_HEIGHT; //pt

  let maxColumns = 0;

  items.forEach((item) => {
    if (
      item.type === "table" &&
      item.columns &&
      item.columns.length > maxColumns
    ) {
      maxColumns = item.columns.length;
    }
  });

  const TOTAL_REPORT_WIDTH = maxColumns > 0 ? maxColumns * COLUMN_WIDTH : 468; //pt
  const TOTAL_REPORT_HIGHT = items && items.length > 0 ? PAGE_HEIGHT : 225; //pt

  const dataItem = items.find((item) => item.type === "data");
  const tableItem = items.find((item) => item.type === "table");

  const dataSetName = "DataSet1";

  const itemsXml = items
    .map((item) => {
      if (item.type === "title") {
        return `
        <Textbox Name="Title_${item.id}">
            <Left>0pt</Left>
            <Top>0pt</Top>
            <Height>${TITLE_HEIGHT}pt</Height>
            <Width>${TOTAL_REPORT_WIDTH}pt</Width>
            <Style>
              <VerticalAlign>${TITLE_TEXT_VERTICAL_ALIGN}</VerticalAlign>
              <PaddingLeft>2pt</PaddingLeft>
              <PaddingRight>2pt</PaddingRight>
              <PaddingTop>2pt</PaddingTop>
              <PaddingBottom>2pt</PaddingBottom>
              <Border>
                <Style>None</Style>
              </Border>
            </Style>
            <CanGrow>true</CanGrow>
            <KeepTogether>true</KeepTogether>
            <Paragraphs>
              <Paragraph>
                <TextRuns>
                  <TextRun>
                    <Value>${escapeXml(
                      item.value.toLocaleUpperCase("tr")
                    )}</Value>
                    <Style>
                      <FontFamily>Trebuchet MS</FontFamily>
                      <FontSize>${TITLE_FONT_SIZE}pt</FontSize>
                      <FontWeight>${TITLE_FONT_WEIGHT}</FontWeight>
                      <Color>Black</Color>
                    </Style>
                  </TextRun>
                </TextRuns>
                <Style>
                  <TextAlign>${TITLE_TEXT_HORIZONTAL_ALIGN}</TextAlign>
                </Style>
              </Paragraph>
            </Paragraphs>
          </Textbox>`;
      }

      if (item.type === "table") {
        const columnsXml = item.columns
          .map(
            () => `
          <TablixColumn>
            <Width>${COLUMN_WIDTH}pt</Width>
          </TablixColumn>`
          )
          .join("");

        const headerCellsXml = item.columns
          .map(
            (col, index) => `
          <TablixCell>
            <CellContents>
              <Textbox Name="Header_${item.id}_${index}">
                          <Left>0pt</Left>
                          <Top>0pt</Top>
                          <Height>${COLUMN_HEIGHT}</Height>
                          <Width>${COLUMN_WIDTH}pt</Width>
                          <Style>
                            <FontSize>${COLUMN_HEADER_FONT_SIZE}pt</FontSize>
                            <VerticalAlign>${COLUMN_TEXT_VERTICAL_ALIGN}</VerticalAlign>
                            <PaddingLeft>2pt</PaddingLeft>
                            <PaddingRight>2pt</PaddingRight>
                            <PaddingTop>2pt</PaddingTop>
                            <PaddingBottom>2pt</PaddingBottom>
                            <Border>
                              <Color>LightGrey</Color>
                              <Style>Solid</Style>
                            </Border>
                          </Style>
                        <CanGrow>true</CanGrow>
                        <KeepTogether>true</KeepTogether>
                        <Paragraphs>
                            <Paragraph>
                              <TextRuns>
                                <TextRun>
                                  <Value>${escapeXml(
                                    convertTitleCase(col.name)
                                  )}</Value>
                                  <Style>
                                    <FontFamily>Trebuchet MS</FontFamily>
                                    <FontSize>${COLUMN_DATA_FONT_SIZE}pt</FontSize>
                                    <FontWeight>${TITLE_FONT_WEIGHT}</FontWeight>
                                    <Color>black</Color>
                                  </Style>
                                </TextRun>
                              </TextRuns>
                              <Style>
                                <FontSize>${COLUMN_HEADER_FONT_SIZE}pt</FontSize>
                                <TextAlign>${COLUMN_TEXT_HORIZONTAL_ALIGN}</TextAlign>
                              </Style>
                            </Paragraph>
                        </Paragraphs>
              </Textbox>
                <ColSpan>1</ColSpan>
                <RowSpan>1</RowSpan>
            </CellContents>
          </TablixCell>`
          )
          .join("");

        const dataCellsXml = item.columns
          .map(
            (col, index) => `
          <TablixCell>
            <CellContents>
              <Textbox Name="Data_${item.id}_${index}">
                  <Left>0in</Left>
                  <Top>0in</Top>
                  <Height>18.6pt</Height>
                  <Width>72pt</Width>
                  <Style>
                    <FontSize>10.00003pt</FontSize>
                    <VerticalAlign>${COLUMN_TEXT_VERTICAL_ALIGN}</VerticalAlign>
                    <PaddingLeft>2pt</PaddingLeft>
                    <PaddingRight>2pt</PaddingRight>
                    <PaddingTop>2pt</PaddingTop>
                    <PaddingBottom>2pt</PaddingBottom>
                    <Border>
                      <Color>LightGrey</Color>
                      <Style>Solid</Style>
                    </Border>
                </Style>
                <CanGrow>true</CanGrow>
                <KeepTogether>true</KeepTogether>
                <Paragraphs>
                  <Paragraph>
                    <TextRuns>
                      <TextRun>
                        <Value>=Fields!${col.mappedField}.Value</Value>
                        <Style>
                           <FontFamily>Trebuchet MS</FontFamily>
                           <FontSize>6.75002pt</FontSize>
                           <Color>black</Color>
                        </Style>
                      </TextRun>
                    </TextRuns>
                    <Style>
                      <FontSize>10.00003pt</FontSize>
                      <TextAlign>${COLUMN_TEXT_HORIZONTAL_ALIGN}</TextAlign>
                    </Style>
                  </Paragraph>
                </Paragraphs>
              </Textbox>
              <ColSpan>1</ColSpan>
              <RowSpan>1</RowSpan>
            </CellContents>
          </TablixCell>`
          )
          .join("");

        return `
        <Tablix Name="Tablix_${item.id}">
            <Left>0pt</Left>
            <Top>${TITLE_HEIGHT}pt</Top>
            <Height>37.50011pt</Height>
            <Width>504.0004pt</Width>
            <Style>
              <FontSize>10.00003pt</FontSize>
              <Border>
                <Style>None</Style>
              </Border>
            </Style>
            
            <DataSetName>${dataSetName}</DataSetName> 
            
          <TablixBody>
            <TablixColumns>
              ${columnsXml}
            </TablixColumns>
            <TablixRows>
              <TablixRow>
                <Height>18.6pt</Height>
                <TablixCells>
                  ${headerCellsXml}
                </TablixCells>
              </TablixRow>
              <TablixRow>
                <Height>18.6pt</Height>
                <TablixCells>
                  ${dataCellsXml}
                </TablixCells>
              </TablixRow>
            </TablixRows>
          </TablixBody>
          <TablixColumnHierarchy>
            <TablixMembers>
              ${item.columns.map(() => "<TablixMember />").join("")}
            </TablixMembers>
          </TablixColumnHierarchy>
          <TablixRowHierarchy>
            <TablixMembers>
              <TablixMember>
                <KeepWithGroup>After</KeepWithGroup>
              </TablixMember>
              <TablixMember>
                <Group Name="Details" />
              </TablixMember>
            </TablixMembers>
          </TablixRowHierarchy>
        </Tablix>`;
      }

      // if (item.type === 'data') {
      //   return "";
      // }

      return "";
    })
    .join("\n");

  let dataXml = "";

  if (
    dataItem &&
    tableItem &&
    dataItem.jsonKeys &&
    dataItem.jsonKeys.length > 0
  ) {
    const fieldsXml = dataItem.jsonKeys
      .map((key) => {
        const mappedColumn = tableItem.columns.find(
          (col) => col.mappedField === key
        );
        const typeName = mappedColumn ? mappedColumn.dataType : "System.String";

        return `
      <Field Name="${escapeXml(key)}">
        <DataField>${escapeXml(key)}</DataField>
        <rd:TypeName>${getRdlTypeName(typeName)}</rd:TypeName>
      </Field>`;
      })
      .join("\n");

    const connectStringData = {
      Data: dataItem.value,
      DataMode: "inline",
      URL: "",
    };

    const connectStringContent = escapeXml(JSON.stringify(connectStringData));

    const dataSourceXml = `
    <DataSources>
      <DataSource Name="DataSource1">
        <ConnectionProperties>
          <DataProvider>JSON</DataProvider>
          <ConnectString>${connectStringContent}</ConnectString>
        </ConnectionProperties>
        <rd:ImpersonateUser>false</rd:ImpersonateUser>
      </DataSource>
    </DataSources>`;

    const queryDesignerColumnsXml = dataItem.jsonKeys
      .map(
        (key) => `
                <Column Name="${escapeXml(
                  key
                )}" IsDuplicate="False" IsSelected="True" />`
      )
      .join("\n");

    const dataSetXml = `
    <DataSets>
      <DataSet Name="${dataSetName}">
        <Fields>
          ${fieldsXml}
        </Fields>
        <Query>
          <DataSourceName>DataSource1</DataSourceName>
          <CommandType>Text</CommandType>
          <CommandText>{"Name":"Result","Columns":[]}</CommandText>
          <QueryDesignerState xmlns="http://schemas.microsoft.com/ReportingServices/QueryDefinition/Relational">
            <Tables>
              <Table Name="Result" Schema="">
                <Columns>
                  ${queryDesignerColumnsXml}
                </Columns>
                <SchemaLevels>
                  <SchemaInfo Name="Result" SchemaType="Table" />
                </SchemaLevels>
              </Table>
            </Tables>
          </QueryDesignerState>
        </Query>
      </DataSet>
    </DataSets>`;

    dataXml = `${dataSourceXml}\n${dataSetXml}`;
  }

  return `<?xml version="1.0"?>
<Report xmlns:df="http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition/defaultfontfamily" xmlns:rd="http://schemas.microsoft.com/SQLServer/reporting/reportdesigner" xmlns="http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition">
  <ReportSections>
    <ReportSection>
      <Body>
        <Style>
          <FontSize>${COLUMN_HEADER_FONT_SIZE}pt</FontSize>
          <Border>
            <Style>None</Style>
          </Border>
        </Style>
        <ReportItems>
          ${itemsXml}
        </ReportItems>
        <Height>${TOTAL_REPORT_HIGHT}pt</Height>
      </Body>
      <Width>${TOTAL_REPORT_WIDTH}pt</Width>
      <Page>
        <PageHeight>792.0023pt</PageHeight>
        <PageWidth>612.0018pt</PageWidth>
        <LeftMargin>72.00021pt</LeftMargin>
        <RightMargin>72.00021pt</RightMargin>
        <TopMargin>72.00021pt</TopMargin>
        <BottomMargin>72.00021pt</BottomMargin>
        <ColumnSpacing>36.00011pt</ColumnSpacing>
        <Style>
          <FontSize>${COLUMN_HEADER_FONT_SIZE}pt</FontSize>
          <Border>
            <Style>None</Style>
          </Border>
        </Style>
      </Page>
    </ReportSection>
  </ReportSections>
  <AutoRefresh>0</AutoRefresh>

  ${dataXml}

  <ReportParametersLayout>
    <GridLayoutDefinition>
      <NumberOfColumns>4</NumberOfColumns>
      <NumberOfRows>2</NumberOfRows>
    </GridLayoutDefinition>
  </ReportParametersLayout>
  <rd:ReportUnitType>Inch</rd:ReportUnitType>
  <rd:PageUnit>Px</rd:PageUnit>
  <df:DefaultFontFamily>Trebuchet MS</df:DefaultFontFamily>
</Report>`;
}

export { generateRDL };
