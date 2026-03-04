import { useMemo, useState } from 'react';
import { Copy, Check, FileCode2 } from 'lucide-react';
import useReportStore from '../../store/useReportStore';
import { generateRDL } from '../../utils';

// ---------------------------------------------------------------------------
// XmlPreview
// Üretilen RDL XML çıktısını canlı olarak gösterir.
// Syntax renklendirme, kopyalama butonu ve satır numaraları içerir.
// ---------------------------------------------------------------------------

// Basit XML syntax renklendirme — harici kütüphane gerektirmez
function highlightXml(xml) {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Tag adları
    .replace(
      /(&lt;\/?)([\w:]+)([\s\S]*?)(\/?&gt;)/g,
      (_, open, tag, attrs, close) => {
        const coloredAttrs = attrs.replace(
          /([\w:]+)(=)(&quot;[^&]*&quot;|"[^"]*")/g,
          '<span style="color:#9CDCFE">$1</span><span style="color:#D4D4D4">$2</span><span style="color:#CE9178">$3</span>',
        );
        return `<span style="color:#808080">${open}</span><span style="color:#4EC9B0">${tag}</span>${coloredAttrs}<span style="color:#808080">${close}</span>`;
      },
    )
    // XML declaration
    .replace(
      /(&lt;\?xml[\s\S]*?\?&gt;)/g,
      '<span style="color:#569CD6">$1</span>',
    );
}

export default function XmlPreview() {
  const reportItems = useReportStore((state) => state.reportItems);
  const [copied, setCopied] = useState(false);

  const xmlContent = useMemo(() => {
    if (!reportItems.length) return null;
    try {
      return generateRDL(reportItems);
    } catch (e) {
      return `<!-- Hata: ${e.message} -->`;
    }
  }, [reportItems]);

  const handleCopy = async () => {
    if (!xmlContent) return;
    await navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!xmlContent) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
        <FileCode2 size={40} className="opacity-40" />
        <p className="text-sm">XML çıktısı oluşturmak için en az bir bileşen ekleyin.</p>
      </div>
    );
  }

  const lines = xmlContent.split('\n');

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      {/* Başlık çubuğu */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E1E1E]">
        <div className="flex items-center gap-2 text-gray-400">
          <FileCode2 size={15} />
          <span className="text-xs font-mono">report.rdl</span>
          <span className="text-xs text-gray-600">— {lines.length} satır</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
        >
          {copied
            ? <><Check size={13} className="text-green-400" /> Kopyalandı</>
            : <><Copy size={13} /> Kopyala</>
          }
        </button>
      </div>

      {/* Kod alanı */}
      <div
        className="overflow-auto"
        style={{ background: '#1E1E1E', maxHeight: '70vh' }}
      >
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/5">
                {/* Satır numarası */}
                <td
                  className="select-none text-right pr-4 pl-4 text-gray-600 font-mono text-xs border-r border-gray-700/50"
                  style={{ minWidth: '3rem', userSelect: 'none' }}
                >
                  {i + 1}
                </td>
                {/* Kod */}
                <td className="pl-4 pr-6 font-mono text-xs whitespace-pre leading-5">
                  <span
                    style={{ color: '#D4D4D4' }}
                    dangerouslySetInnerHTML={{
                      __html: highlightXml(line) || '&nbsp;',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
