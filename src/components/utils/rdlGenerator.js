const generateRDL = (items) => {
  const itemsXml = items.map(item => {
    // 1. TEXTBOX (RAPOR BAŞLIĞI)
    if (item.type === 'textbox') {
      return `
        <Textbox Name="Textbox_${item.id}">
            <Left>149.25pt</Left>
            <Top>4.5pt</Top>
            <Height>49.5pt</Height>
            <Width>168pt</Width>
            <Style>
              <VerticalAlign>Middle</VerticalAlign>
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
                    <Value>${item.value}</Value>
                    <Style>
                      <FontFamily>Trebuchet MS</FontFamily>
                      <FontSize>10.5pt</FontSize>
                      <FontWeight>Bold</FontWeight>
                      <Color>Black</Color>
                    </Style>
                  </TextRun>
                </TextRuns>
                <Style>
                  <TextAlign>Center</TextAlign>
                </Style>
              </Paragraph>
            </Paragraphs>
          </Textbox>`;
    }
    
    // 2. TABLIX (TABLO)
    if (item.type === 'table') {
      const columnCount = item.columns.length;
      // Sütun genişlikleri (basitlik için sabit)
      const columnsXml = item.columns.map(() => `
          <TablixColumn>
            <Width>1.1in</Width>
          </TablixColumn>`).join('');

      // Tablo Header Hücreleri
      const headerCellsXml = item.columns.map((col, index) => `
          <TablixCell>
            <CellContents>
              <Textbox Name="Header_${item.id}_${index}">
                                        <Left>0in</Left>
                          <Top>0in</Top>
                          <Height>18pt</Height>
                          <Width>33pt</Width>
                          <Style>
                            <VerticalAlign>Middle</VerticalAlign>
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
                        <KeepTogether>true</KeepTogether>s
                        <Paragraphs>
                            <Paragraph>
                              <TextRuns>
                                <TextRun>
                                  <Value>Tip</Value>
                                  <Style>
                                    <FontFamily>Trebuchet MS</FontFamily>
                                    <FontSize>7.5pt</FontSize>
                                    <FontWeight>Bold</FontWeight>
                                    <Color>black</Color>
                                  </Style>
                                </TextRun>
                              </TextRuns>
                              <Style>
                                <TextAlign>Left</TextAlign>
                              </Style>
                            </Paragraph>
                        </Paragraphs>
              </Textbox>
                <ColSpan>1</ColSpan>
                <RowSpan>1</RowSpan>
            </CellContents>
          </TablixCell>`).join('');

      // Tablo Data Hücreleri (Örnek veri bağlama placeholder'ı)
      const dataCellsXml = item.columns.map((col, index) => `
          <TablixCell>
            <CellContents>
              <Textbox Name="Data_${item.id}_${index}">
                <CanGrow>true</CanGrow>
                <Paragraphs>
                  <Paragraph>
                    <TextRuns>
                      <TextRun>
                        <Value>=Fields!${col.name}.Value</Value>
                        <Style />
                      </TextRun>
                    </TextRuns>
                    <Style />
                  </Paragraph>
                </Paragraphs>
                <Style>
                  <BorderStyle>
                    <Default>Solid</Default>
                  </BorderStyle>
                  <PaddingLeft>2pt</PaddingLeft>
                  <PaddingRight>2pt</PaddingRight>
                  <PaddingTop>2pt</PaddingTop>
                  <PaddingBottom>2pt</PaddingBottom>
                </Style>
              </Textbox>
            </CellContents>
          </TablixCell>`).join('');

      return `
        <Tablix Name="Tablix_${item.id}">
          <TablixBody>
            <TablixColumns>
              ${columnsXml}
            </TablixColumns>
            <TablixRows>
              <TablixRow>
                <Height>0.25in</Height>
                <TablixCells>
                  ${headerCellsXml}
                </TablixCells>
              </TablixRow>
              <TablixRow>
                <Height>0.25in</Height>
                <TablixCells>
                  ${dataCellsXml}
                </TablixCells>
              </TablixRow>
            </TablixRows>
          </TablixBody>
          <TablixColumnHierarchy>
            <TablixMembers>
              ${item.columns.map(() => '<TablixMember />').join('')}
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
          <Top>1in</Top>
          <Left>0in</Left>
          <Height>0.5in</Height>
          <Width>${columnCount * 1.5}in</Width>
          <Style>
            <Border>
              <Style>None</Style>
            </Border>
          </Style>
        </Tablix>`;
    }
    return '';
  }).join('\n');

  // Ana XML İskeleti
  return `<?xml version="1.0"?>
<Report xmlns:df="http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition/defaultfontfamily" xmlns:rd="http://schemas.microsoft.com/SQLServer/reporting/reportdesigner" xmlns="http://schemas.microsoft.com/sqlserver/reporting/2016/01/reportdefinition">
  <ReportSections>
    <ReportSection>
      <Body>
        <Style>
          <Border>
            <Style>None</Style>
          </Border>
        </Style>
        <ReportItems>
          ${itemsXml}
        </ReportItems>
        <Height>3.125in</Height>
      </Body>
      <Width>6.5in</Width>
      <Page>
        <PageFooter>
          <Style>
            <Border>
              <Style>None</Style>
            </Border>
          </Style>
          <Height>0.72917in</Height>
          <PrintOnFirstPage>true</PrintOnFirstPage>
          <PrintOnLastPage>true</PrintOnLastPage>
        </PageFooter>
        <LeftMargin>1in</LeftMargin>
        <RightMargin>1in</RightMargin>
        <TopMargin>1in</TopMargin>
        <BottomMargin>1in</BottomMargin>
        <Style>
          <Border>
            <Style>None</Style>
          </Border>
        </Style>
      </Page>
    </ReportSection>
  </ReportSections>
  <AutoRefresh>0</AutoRefresh>
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
};


export { generateRDL };