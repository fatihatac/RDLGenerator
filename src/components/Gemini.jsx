import React, { useState } from 'react';
import { Plus, Trash2, Download, FileText, Table, LayoutTemplate, X } from 'lucide-react';

// --- YARDIMCI FONKSİYONLAR (RDL OLUŞTURUCU) ---

/**
 * Bu fonksiyon React state'ini alıp geçerli bir RDL XML string'ine dönüştürür.
 * Bold Reports ve SSRS standartlarına uygun namespace kullanır.
 */
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


// --- ALT BİLEŞENLER (COMPONENTS) ---

/**
 * Textbox Düzenleme Bileşeni
 */
const TextboxEditor = ({ item, updateItem, deleteItem }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-blue-600 font-semibold">
          <FileText size={18} className="mr-2" />
          <span>Rapor Başlığı / Metin</span>
        </div>
        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Görüntülenecek Metin</label>
        <input
          type="text"
          value={item.value}
          onChange={(e) => updateItem(item.id, { value: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Örn: Satış Raporu 2025"
        />
      </div>
    </div>
  );
};

/**
 * Tablo Düzenleme Bileşeni
 */
const TableEditor = ({ item, updateItem, deleteItem }) => {
  const addColumn = () => {
    const newCol = { id: Date.now(), name: `Sütun ${item.columns.length + 1}` };
    updateItem(item.id, { columns: [...item.columns, newCol] });
  };

  const updateColumnName = (colId, newName) => {
    const newCols = item.columns.map(c => c.id === colId ? { ...c, name: newName } : c);
    updateItem(item.id, { columns: newCols });
  };

  const removeColumn = (colId) => {
    const newCols = item.columns.filter(c => c.id !== colId);
    updateItem(item.id, { columns: newCols });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-green-600 font-semibold">
          <Table size={18} className="mr-2" />
          <span>Veri Tablosu</span>
        </div>
        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sütun Tanımları</label>
        <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
          {item.columns.length === 0 && <p className="text-xs text-gray-400 italic">Henüz sütun eklenmedi.</p>}
          
          {item.columns.map((col, idx) => (
            <div key={col.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
              <input
                type="text"
                value={col.name}
                onChange={(e) => updateColumnName(col.id, e.target.value)}
                className="flex-1 p-1.5 text-sm border border-gray-300 rounded focus:border-green-500 outline-none"
                placeholder="Alan Adı (Örn: Ad)"
              />
              <button onClick={() => removeColumn(col.id)} className="text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={addColumn}
        className="text-sm flex items-center text-green-600 hover:text-green-700 font-medium"
      >
        <Plus size={16} className="mr-1" /> Sütun Ekle
      </button>
    </div>
  );
};

// --- ANA UYGULAMA (APP) ---

export default function App() {
  const [reportItems, setReportItems] = useState([]);

  // Yeni öğe ekleme
  const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      type,
      // Textbox için varsayılan değerler
      ...(type === 'textbox' && { value: 'Yeni Başlık' }),
      // Tablo için varsayılan değerler
      ...(type === 'table' && { columns: [{ id: Date.now(), name: 'ID' }, { id: Date.now() + 1, name: 'İsim' }] }),
    };
    setReportItems([...reportItems, newItem]);
  };

  // Öğe güncelleme
  const updateItem = (id, newData) => {
    setReportItems(reportItems.map(item => item.id === id ? { ...item, ...newData } : item));
  };

  // Öğe silme
  const deleteItem = (id) => {
    setReportItems(reportItems.filter(item => item.id !== id));
  };

  // RDL İndirme işlemi
  const downloadReport = () => {
    const rdlContent = generateRDL(reportItems);
    const blob = new Blob([rdlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TaslakRapor.rdl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-slate-800">
      {/* Üst Bar */}
      <header className="bg-indigo-700 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <LayoutTemplate />
          <h1 className="text-xl font-bold">Bold Reports Tasarımcısı</h1>
        </div>
        <button
          onClick={downloadReport}
          className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-md flex items-center font-medium transition-colors shadow-sm"
        >
          <Download size={18} className="mr-2" />
          RDL İndir
        </button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sol Panel: Araç Kutusu */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-inner z-0">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bileşenler</h2>
          
          <button
            onClick={() => addItem('textbox')}
            className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-lg transition-all text-left group"
          >
            <div className="bg-blue-100 text-blue-600 p-2 rounded mr-3 group-hover:bg-blue-200">
              <FileText size={20} />
            </div>
            <div>
              <span className="block font-medium text-gray-700">Metin Kutusu</span>
              <span className="text-xs text-gray-500">Başlık veya etiket için</span>
            </div>
          </button>

          <button
            onClick={() => addItem('table')}
            className="flex items-center p-3 bg-gray-50 hover:bg-green-50 hover:border-green-300 border border-gray-200 rounded-lg transition-all text-left group"
          >
            <div className="bg-green-100 text-green-600 p-2 rounded mr-3 group-hover:bg-green-200">
              <Table size={20} />
            </div>
            <div>
              <span className="block font-medium text-gray-700">Tablo</span>
              <span className="text-xs text-gray-500">Veri listelemek için</span>
            </div>
          </button>
        </aside>

        {/* Orta Panel: Tasarım Alanı (Canvas) */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rapor Taslağı</h2>
              <span className="text-sm text-gray-500">{reportItems.length} bileşen eklendi</span>
            </div>

            {reportItems.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50/50">
                <LayoutTemplate size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Raporunuz boş.</p>
                <p className="text-gray-400 text-sm mt-1">Soldaki menüden bileşen ekleyerek başlayın.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reportItems.map((item) => (
                  <div key={item.id}>
                    {item.type === 'textbox' && (
                      <TextboxEditor 
                        item={item} 
                        updateItem={updateItem} 
                        deleteItem={deleteItem} 
                      />
                    )}
                    {item.type === 'table' && (
                      <TableEditor 
                        item={item} 
                        updateItem={updateItem} 
                        deleteItem={deleteItem} 
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}