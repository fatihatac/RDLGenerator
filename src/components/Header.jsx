import { Download, LayoutTemplate, } from 'lucide-react';

function Header({ downloadReport }) {

    return (
        <header className="bg-indigo-700 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <LayoutTemplate />
                <h1 className="text-xl font-bold">Bold Reports Designer</h1>
            </div>
            <button
                onClick={downloadReport}
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-md flex items-center font-medium transition-colors shadow-sm"
            >
                <Download size={18} className="mr-2" />
                RDL İndir
            </button>
        </header>)
}

export default Header;