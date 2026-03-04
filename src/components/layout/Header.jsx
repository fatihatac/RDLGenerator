import { useState } from 'react';
import { BookTemplate } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import DownloadActions from '../actions/DownloadActions';
import TemplateModal from '../actions/TemplateModal';

function Header() {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <>
      <header className="bg-[#e12f27] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <BrandLogo />

        <div className="flex items-center gap-4">
          {/* Şablonlar butonu */}
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            <BookTemplate size={16} />
            Şablonlar
          </button>

          <DownloadActions />
        </div>
      </header>

      {showTemplates && (
        <TemplateModal onClose={() => setShowTemplates(false)} />
      )}
    </>
  );
}

export default Header;
