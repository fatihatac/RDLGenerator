import { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Table, BarChart2, Layers, Calculator, Database } from 'lucide-react';
import { XMLParser } from "fast-xml-parser";

function XmlAnalysisModal({ onClose }) {
  const [xmlContent, setXmlContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleXmlChange = (e) => {
    setXmlContent(e.target.value);
  };

  const parseXml = (xmlString) => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      allowBooleanAttributes: true,
      parseAttributeValue: true,
      parseTagValue: true,
      trimValues: true,
    });
    return parser.parse(xmlString);
  };

  const getTextboxValue = (item) => {
    if (!item) return null;
    
    if (item.Value) {
      return typeof item.Value === 'string' ? item.Value : null;
    }
    
    if (item.Paragraphs?.Paragraph) {
      const para = Array.isArray(item.Paragraphs.Paragraph) 
        ? item.Paragraphs.Paragraph[0] 
        : item.Paragraphs.Paragraph;
      if (para?.TextRuns?.TextRun) {
        const textRun = Array.isArray(para.TextRuns.TextRun) 
          ? para.TextRuns.TextRun[0] 
          : para.TextRuns.TextRun;
        return textRun?.Value || null;
      }
    }
    
    return null;
  };

  const getHeightInPoints = (heightValue) => {
    if (!heightValue) return 0;
    const str = String(heightValue);
    const match = str.match(/([\d.]+)/);
    if (match) {
      const num = parseFloat(match[1]);
      if (str.includes('in')) return num * 72;
      if (str.includes('cm')) return num / 2.54 * 72;
      if (str.includes('mm')) return num / 25.4 * 72;
      return num;
    }
    return 0;
  };

  const isDataBound = (value) => {
    if (!value || typeof value !== 'string') return false;
    return value.includes('=Fields!') || value.startsWith('Fields!');
  };

  // More precise analysis based on actual RDL structure
  const analyzeRdlStructure = (obj) => {
    const result = {
      titles: [],
      tables: [],
      charts: [],
      dataSources: [],
      dataSets: [],
      totalColumns: 0,
      totalGroups: 0,
      totalSums: 0,
    };

    if (!obj || typeof obj !== 'object') {
      return result;
    }

    // Navigate to ReportSections -> ReportSection -> Body -> ReportItems
    // Handle namespace by getting first-level keys
    const rootKey = Object.keys(obj).find(k => k.toLowerCase() === 'report') || Object.keys(obj)[0];
    const report = obj[rootKey] || obj;
    const reportSections = report?.ReportSections;
    if (!reportSections) return result;
    
    const sectionArray = Array.isArray(reportSections) ? reportSections : [reportSections];
    const reportSection = sectionArray[0]?.ReportSection || sectionArray[0];
        
    const body = reportSection?.Body;
    if (!body) return result;
    
    const reportItems = body?.ReportItems;
    if (!reportItems) return result;

    // Get all report item elements - only direct children of ReportItems
    const items = [];
    const itemKeys = [];
    
    if (Array.isArray(reportItems)) {
      for (const it of reportItems) {
        if (it && typeof it === 'object') {
          const name = it['@_Name'] || it.Name;
          if (name) {
            items.push(it);
            itemKeys.push(name);
          }
        }
      }
    } else if (typeof reportItems === 'object') {
      for (const key of Object.keys(reportItems)) {
        if (key === 'Style' || key === '@_Name' || key === 'TablixColumns' || key === 'TablixRows') continue;
        
        const item = reportItems[key];
        if (item && typeof item === 'object') {
          const name = item['@_Name'] || item.Name;
          if (name && (key === 'Textbox' || key === 'Tablix' || key === 'Chart')) {
            items.push(item);
            itemKeys.push(name);
          }
        }
      }
    }

    // Analyze each report item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemName = item['@_Name'] || item.Name || '';
      
      // Detect Textbox (Title) - check height >= 30pt
      if (item.Paragraphs && itemName) {
        const height = getHeightInPoints(item.Height);
        const value = getTextboxValue(item);
        
        // Title should be: height >= 30pt AND not data-bound
        if (height >= 30 && value && !isDataBound(value)) {
          result.titles.push({
            name: itemName,
            value: value,
          });
        }
      }

      // Detect Tablix (Table) - must have TablixBody and Name starting with Tablix
      if (item.TablixBody && itemName && itemName.toLowerCase().startsWith('tablix')) {
        let colCount = 0;
        const columnNames = [];
        const groups = [];
        
        if (item.TablixBody.TablixColumns?.TablixColumn) {
          const cols = item.TablixBody.TablixColumns.TablixColumn;
          colCount = Array.isArray(cols) ? cols.length : 1;
        }

        // Get column names from header row
        if (item.TablixBody.TablixRows?.TablixRow) {
          const rows = item.TablixBody.TablixRows.TablixRow;
          const rowArray = Array.isArray(rows) ? rows : [rows];
          const headerRow = rowArray[0];
          if (headerRow?.TablixCells?.TablixCell) {
            const cells = headerRow.TablixCells.TablixCell;
            const cellArray = Array.isArray(cells) ? cells : [cells];
            for (const cell of cellArray) {
              if (cell?.CellContents?.Textbox) {
                const headerTextbox = cell.CellContents.Textbox;
                const headerValue = getTextboxValue(headerTextbox);
                if (headerValue) {
                  columnNames.push(headerValue);
                }
              }
            }
          }
        }

        if (item.TablixRowHierarchy?.TablixMembers?.TablixMember) {
          const members = item.TablixRowHierarchy.TablixMembers.TablixMember;
          const memberArray = Array.isArray(members) ? members : [members];
          for (const member of memberArray) {
            if (member?.Group) {
              const groupName = member.Group['@_Name'] || member.Group.Name;
              if (groupName) {
                groups.push({ name: groupName });
                result.totalGroups++;
              }
            }
          }
        }

        // Extract field names from data rows if available
        const fieldNames = new Set();
        if (item.TablixBody.TablixRows?.TablixRow) {
          const rows = item.TablixBody.TablixRows.TablixRow;
          const rowArray = Array.isArray(rows) ? rows : [rows];
          for (let r = 1; r < rowArray.length; r++) {
            const dataRow = rowArray[r];
            if (dataRow?.TablixCells?.TablixCell) {
              const cells = dataRow.TablixCells.TablixCell;
              const cellArray = Array.isArray(cells) ? cells : [cells];
              for (const cell of cellArray) {
                if (cell?.CellContents?.Textbox) {
                  const dataTextbox = cell.CellContents.Textbox;
                  const dataValue = getTextboxValue(dataTextbox);
                  if (dataValue && dataValue.includes('=Fields!')) {
                    const match = dataValue.match(/=Fields!(\w+)\.Value/);
                    if (match) fieldNames.add(match[1]);
                  }
                }
              }
            }
          }
        }

        result.tables.push({
          name: itemName,
          dataSetName: item.DataSetName || 'N/A',
          columnCount: colCount,
          columnNames: columnNames,
          fieldNames: Array.from(fieldNames),
          groups: groups
        });
        result.totalColumns += colCount;
      }

      if (item.Chart && itemName) {
        result.charts.push({
          name: itemName,
          type: item.Type || 'Unknown'
        });
      }
    }

    // Find DataSources in the main Report section
    if (report.DataSources?.DataSource) {
      const dsArray = Array.isArray(report.DataSources.DataSource) 
        ? report.DataSources.DataSource 
        : [report.DataSources.DataSource];
      result.dataSources = dsArray.map(ds => ({
        name: ds['@_Name'] || ds.Name || 'Unnamed',
        connectionString: ds.ConnectionProperties?.ConnectString || 'N/A'
      }));
    }

    // Find DataSets in the main Report section
    if (report.DataSets?.DataSet) {
      const dsArray = Array.isArray(report.DataSets.DataSet) 
        ? report.DataSets.DataSet 
        : [report.DataSets.DataSet];
      result.dataSets = dsArray.map(ds => ({
        name: ds['@_Name'] || ds.Name || 'Unnamed',
        fields: (ds.Fields?.Field || []).map(f => ({
          name: f['@_Name'] || f.Name || 'Unknown',
          dataField: f.DataField || ''
        }))
      }));
    }

    // Search for Sum aggregations
    const findSumAggregations = (item, depth = 0) => {
      if (!item || typeof item !== 'object' || depth > 15) return;
      
      for (const key of Object.keys(item)) {
        const val = item[key];
        if (typeof val === 'string' && val.toLowerCase().includes('sum(')) {
          const matches = val.match(/sum\(/gi);
          result.totalSums += matches.length;
        }
        if (typeof val === 'object') {
          findSumAggregations(val, depth + 1);
        }
      }
    };
    
    findSumAggregations(report);

    return result;
  };

  const handleAnalyzeXml = async () => {
    if (!xmlContent.trim()) {
      setError('Lütfen XML içeriği girin');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const jsonObj = parseXml(xmlContent);
      const analysis = analyzeRdlStructure(jsonObj);
      setAnalysisResult(analysis);
    } catch (err) {
      console.error('XML parsing error:', err);
      setError(`XML ayrıştırma hatası: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const AnalysisSection = ({ title, icon: IconComponent, items, count, type }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        {IconComponent && <IconComponent size={18} className="text-blue-500" />}
        <h4 className="font-medium text-gray-800">{title}</h4>
        {count !== undefined && count > 0 && (
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">{item.name}</span>
                {item.dataSetName && item.dataSetName !== 'N/A' && (
                  <span className="text-gray-400 text-xs">({item.dataSetName})</span>
                )}
                {item.columnCount !== undefined && (
                  <span className="text-gray-400 text-xs">({item.columnCount} kolon)</span>
                )}
                {item.value && (
                  <span className="text-gray-500 text-xs ml-2 truncate max-w-[200px]">
                    "{item.value}"
                  </span>
                )}
              </div>
              
              {/* Kolon isimleri (header) */}
              {type === 'table' && item.columnNames && item.columnNames.length > 0 && (
                <div className="mt-1 ml-4 flex flex-wrap gap-1">
                  {item.columnNames.map((col, cidx) => (
                    <span key={cidx} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                      {col}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Veri alan isimleri */}
              {type === 'table' && item.fieldNames && item.fieldNames.length > 0 && (
                <div className="mt-1 ml-4 text-xs">
                  <span className="text-green-600 font-medium">Alanlar: </span>
                  {item.fieldNames.join(', ')}
                </div>
              )}
              
              {/* Gruplar */}
              {type === 'table' && item.groups && item.groups.length > 0 && (
                <div className="mt-1 ml-4 text-xs">
                  <span className="text-purple-600">Gruplar: </span>
                  {item.groups.map(g => g.name).join(', ')}
                </div>
              )}
              
              {/* DataSource detayları */}
              {type === 'datasource' && item.connectionString && (
                <div className="mt-1 ml-4 text-xs text-gray-500">
                  <span className="font-medium">Bağlantı: </span>
                  <span className="truncate max-w-[250px] inline-block align-bottom">
                    {item.connectionString}
                  </span>
                </div>
              )}
              
              {/* DataSet alanları */}
              {type === 'dataset' && item.fields && item.fields.length > 0 && (
                <div className="mt-1 ml-4 flex flex-wrap gap-1">
                  {item.fields.map((field, fidx) => (
                    <span key={fidx} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">
                      {field.name}{field.dataField ? ` → ${field.dataField}` : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Tespit edilmedi</p>
      )}
    </div>
  );

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">XML analiz ediliyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertTriangle size={18} className="text-orange-500 mr-2" />
              Analiz Hatası
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button onClick={onClose} className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Kapat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 my-8 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FileText size={18} className="mr-2 text-blue-500" />
            XML Rapor Analizi
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              XML İçeriği (RDL/RDLC dosyası içeriğini buraya yapıştırın)
            </label>
            <textarea
              value={xmlContent}
              onChange={handleXmlChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
              rows="8"
              placeholder='<?xml version="1.0"?>...'
            />
          </div>

          <button
            onClick={handleAnalyzeXml}
            disabled={!xmlContent.trim()}
            className="w-full flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={18} className="mr-2" />
            XML'i Analiz Et
          </button>

          {analysisResult && (
            <div className="mt-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Analiz Özeti</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white rounded p-2 text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.titles.length}</div>
                    <div className="text-gray-500">Başlık</div>
                  </div>
                  <div className="bg-white rounded p-2 text-center">
                    <div className="text-2xl font-bold text-green-600">{analysisResult.tables.length}</div>
                    <div className="text-gray-500">Tablo</div>
                  </div>
                  <div className="bg-white rounded p-2 text-center">
                    <div className="text-2xl font-bold text-purple-600">{analysisResult.totalGroups}</div>
                    <div className="text-gray-500">Grup</div>
                  </div>
                  <div className="bg-white rounded p-2 text-center">
                    <div className="text-2xl font-bold text-orange-600">{analysisResult.totalSums}</div>
                    <div className="text-gray-500">Toplam</div>
                  </div>
                </div>
              </div>

              <AnalysisSection 
                title="Başlıklar (Textbox)" 
                icon={FileText}
                items={analysisResult.titles}
                count={analysisResult.titles.length}
                type="title"
              />

              <AnalysisSection 
                title="Tablolar (Tablix)" 
                icon={Table}
                items={analysisResult.tables}
                count={analysisResult.tables.length}
                type="table"
              />

              <AnalysisSection 
                title="Grafikler" 
                icon={BarChart2}
                items={analysisResult.charts}
                count={analysisResult.charts.length}
                type="chart"
              />

              <AnalysisSection 
                title="Veri Kaynakları (DataSource)" 
                icon={Database}
                items={analysisResult.dataSources}
                count={analysisResult.dataSources.length}
                type="datasource"
              />

              <AnalysisSection 
                title="Veri Setleri (DataSet)" 
                icon={Layers}
                items={analysisResult.dataSets}
                count={analysisResult.dataSets.length}
                type="dataset"
              />

              {analysisResult.totalColumns > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator size={18} className="text-gray-600" />
                    <h4 className="font-medium text-gray-800">Toplam Kolon Sayısı</h4>
                    <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {analysisResult.totalColumns}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Tespit edilen tablolardaki toplam kolon sayısı
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default XmlAnalysisModal;