import { useState } from 'react';
import { Download } from 'lucide-react';

const DownloadActions = ({ downloadReport }) => { 
    const [fileName, setFileName] = useState('');

    const handleDownload = () => {
        downloadReport(fileName);
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <input
                    name="fileNameInput"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Dosya Adı"
                    className='w-full px-4 py-2 rounded-md bg-white text-[#9D201B] placeholder:text-[#9D201B]/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9D201B] focus:border-[#9D201B] pr-12' 
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9D201B] text-xs pointer-events-none font-bold">
                    .rdl
                </span>
            </div>
            <button
                onClick={handleDownload}
                className="bg-white text-[#9D201B] hover:bg-[#fee2e2] px-4 py-2 rounded-md flex items-center font-medium transition-colors shadow-sm active:scale-95"
            >
                <Download size={18} className="mr-2" />
                İndir
            </button>
        </div>
    );
};

export default DownloadActions;