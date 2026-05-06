import { BookTemplate, FilePlus, Settings2, Upload } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import DownloadActions from '../actions/DownloadActions';
import TemplateModal from '../actions/TemplateModal';
import ConfirmModal from '../ui/ConfirmModal';
import SettingsPanel from './SettingsPanel';
import ReportTypeSelector from '../ui/ReportTypeSelector';
import XmlAnalysisModal from './XmlAnalysisModal';
import Button from '../ui/Button';
import useModalState from '../../hooks/useModalState';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';

function Header() {
  const { 
    modals, 
    openModal, 
    closeModal
  } = useModalState({
    showTemplates: false,
    showConfirm: false,
    showSettings: false,
    showXmlAnalysis: false
  });

  const { resetReport, reportItems, reportType, setReportType } = useReportStore(
    useShallow((state) => ({
      resetReport: state.resetReport,
      reportItems: state.reportItems,
      reportType: state.reportType,
      setReportType: state.setReportType,
    }))
  );

  const handleConfirmReset = () => {
    resetReport();
    closeModal('showConfirm');
  };

  return (
    <>
      <header className="bg-[#e12f27] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <BrandLogo />
          
          <ReportTypeSelector value={reportType} onChange={setReportType} />
        </div>

        <div className="flex items-center gap-4">

          <Button
            onClick={() => openModal('showConfirm')}
            disabled={reportItems.length === 0}
            title="Tüm bileşenleri temizle ve yeni rapor başlat"
            variant="default"
          >
            <FilePlus size={16} />
            Yeni Rapor
          </Button>

          <Button
            onClick={() => openModal('showTemplates')}
            variant="default"
          >
            <BookTemplate size={16} />
            Şablonlar
          </Button>

           {/* ── YENİ: Ayarlar butonu ── */}
            <Button
              onClick={() => openModal('showSettings')}
              title="Rapor ölçülerini ve ayarlarını düzenle"
              variant="default"
              isActive={modals.showSettings}
            >
              <Settings2 size={16} />
              Ayarlar
            </Button>

             {/* ── YENİ: XML Analizi butonu ── */}
             <Button
               onClick={() => openModal('showXmlAnalysis')}
               title="XML dosyası yükle ve analiz et"
               variant="default"
               isActive={modals.showXmlAnalysis}
             >
               <Upload size={16} />
               XML Analiz
             </Button>

          <DownloadActions />
        </div>
      </header>

      {modals.showTemplates && (
        <TemplateModal onClose={() => closeModal('showTemplates')} />
      )}

      {modals.showConfirm && (
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
          onCancel={() => closeModal('showConfirm')}
        />
      )}

       {modals.showSettings && (
         <SettingsPanel onClose={() => closeModal('showSettings')} />
       )}

       {modals.showXmlAnalysis && (
         <XmlAnalysisModal onClose={() => closeModal('showXmlAnalysis')} />
       )}
     </>
   );
}

export default Header;
