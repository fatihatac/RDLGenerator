import BrandLogo from '../ui/BrandLogo';
import DownloadActions from '../actions/DownloadActions';

function Header({ downloadReport, reportItems }) {
    return (
        <header className="bg-[#e12f27] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
            <BrandLogo />
            <DownloadActions downloadReport={downloadReport} reportItems={reportItems} />
        </header>
    );
}

export default Header;