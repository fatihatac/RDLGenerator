import { useState } from 'react';
import { BookTemplate, FilePlus, Settings2 } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import DownloadActions from '../actions/DownloadActions';
import TemplateModal from '../actions/TemplateModal';
import ConfirmModal from '../ui/ConfirmModal';
import SettingsPanel from './SettingsPanel';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { REPORT_TYPE_OPTIONS } from '../../constants/reportTypes';

function Header() {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { resetReport, reportItems, reportType, setReportType } = useReportStore(
    useShallow((state) => ({
      resetReport: state.resetReport,
      reportItems: state.reportItems,
      reportType: state.reportType,
      setReportType: state.setReportType,
    })),
  );

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleConfirmReset = () => {
    resetReport();
    setShowConfirm(false);
  };

  return (
    <>
      <header className="bg-[#e12f27] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <BrandLogo />
          
          <select 
            value={reportType}
            onChange={handleReportTypeChange}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-md px-3 py-1.5 outline-none cursor-pointer border border-transparent focus:border-white/30"
          >
            {/* Rapor tiplerini otomatik olarak dönüyoruz */}
            {REPORT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="text-black">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() => setShowConfirm(true)}
            disabled={reportItems.length === 0}
            title="Tüm bileşenleri temizle ve yeni rapor başlat"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FilePlus size={16} />
            Yeni Rapor
          </button>

          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            <BookTemplate size={16} />
            Şablonlar
          </button>

          {/* ── YENİ: Ayarlar butonu ── */}
          <button
            onClick={() => setShowSettings(true)}
            title="Rapor ölçülerini ve ayarlarını düzenle"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${showSettings
                ? 'bg-white text-[#e12f27]'
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
          >
            <Settings2 size={16} />
            Ayarlar
          </button>

          <DownloadActions />
        </div>
      </header>

      {showTemplates && (
        <TemplateModal onClose={() => setShowTemplates(false)} />
      )}

      {showConfirm && (
        <ConfirmModal
          title="Raporu Sıfırla"
          description={
            <>
              Mevcut tüm rapor bileşenleri ve veriler silinecek. Bu işlem{' '}
              <span className="font-semibold text-red-600">geri alınamaz</span>.
              Devam etmek istiyor musunuz?
            </>
          }
          confirmLabel="Evet, Sıfırla"
          onConfirm={handleConfirmReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}

export default Header;
