import { LayoutTemplate } from 'lucide-react';

function EmptyReport() {
    return (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50/50">
            <LayoutTemplate size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Raporunuz boş.</p>
            <p className="text-gray-400 text-sm mt-1">Soldaki menüden bileşen ekleyerek başlayın.</p>
        </div>
    );
}

export default EmptyReport