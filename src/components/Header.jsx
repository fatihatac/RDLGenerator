import { Download, LayoutTemplate, } from 'lucide-react';
import { useState } from 'react';

function Header({ downloadReport }) {
    const [fileName, setFileName] = useState('');

    function handleDownload() {
        downloadReport(fileName);
    }

    return (
        <header className="bg-[#e12f27] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <LayoutTemplate />
                <h1 className="text-xl font-bold">Bold Reports Designer</h1>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        name="fileNameInput"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Dosya Adı"
                        className='w-full px-4 py-2 rounded-md bg-white text-[#9D201B]  placeholder:text-[#9D201B] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9D201B] focus:border-[#9D201B]'
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9D201B] text-xs pointer-events-none">
                        .rdl
                    </span>
                </div>
                <button
                    onClick={handleDownload}
                    className="bg-white text-[#9D201B] hover:bg-[#C0E0E4] px-4 py-2 rounded-md flex items-center font-medium transition-colors shadow-sm"
                >
                    <Download size={18} className="mr-2" />
                    RDL İndir
                </button>
            </div>
        </header>)
}

export default Header;