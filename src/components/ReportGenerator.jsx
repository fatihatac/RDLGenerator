import React, { useState } from "react";

const ReportGenerator = () => {
  const [reportTitle, setReportTitle] = useState("");

  const handleGenerateXml = () => {
    const dynamicTitleXML = `<Textbox Name="TextBox1">
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
                    <Value>${reportTitle}</Value>
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

    const xmlContent = `<?xml version="1.0"?>
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
          ${dynamicTitleXML}
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
  <df:DefaultFontFamily>Segoe UI</df:DefaultFontFamily>
</Report>`;

    // --- 3. Dosya İndirme Mekanizması ---
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    // Dosya adı, girilen başlığa göre otomatik belirlensin
    link.download = `${reportTitle.replace(/\s/g, "_")}_Raporu.rdl`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Bellek sızıntısını önler
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>1. Rapor Başlığını Girin</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          placeholder="Rapor Başlığını Girin"
          style={{
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
            fontSize: "16px",
          }}
        />
      </div>

      <button
        onClick={handleGenerateXml}
        style={{
          padding: "12px 25px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Rapor Başlığı XML Dosyasını İndir (.rdl)
      </button>
    </div>
  );
};

export default ReportGenerator;
