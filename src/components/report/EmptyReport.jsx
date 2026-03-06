import { FileBraces, Table, FileText, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num: '1',
    Icon: FileBraces,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 border-yellow-200',
    numBg: 'bg-yellow-500',
    title: 'JSON Veri Ekle',
    desc: 'Soldaki menüden "JSON Datasource" ekleyerek verinizi yapıştırın.',
  },
  {
    num: '2',
    Icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-200',
    numBg: 'bg-blue-500',
    title: 'Başlık Oluştur',
    desc: '"Metin Kutusu" ile raporunuza bir başlık verin.',
  },
  {
    num: '3',
    Icon: Table,
    color: 'text-green-500',
    bg: 'bg-green-50 border-green-200',
    numBg: 'bg-green-500',
    title: 'Tablo Ekle',
    desc: '"Tablo" bileşeniyle verilerinizi düzenleyin ve sütunları yapılandırın.',
  },
];

export default function EmptyReport() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 select-none">

      {/* Ana ikon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#e12f27]" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        {/* Pulsar efekti */}
        <div className="absolute inset-0 rounded-2xl bg-red-200 animate-ping opacity-20" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-1">Raporunuz boş</h3>
      <p className="text-gray-400 text-sm mb-10 text-center max-w-xs">
        Soldaki menüden bileşen ekleyerek başlayın. Aşağıdaki adımları takip edebilirsiniz.
      </p>

      {/* Adım kartları */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-2xl">
        {STEPS.map((step, i) => (
          <div key={step.num} className="flex sm:flex-col items-start sm:items-center gap-3 flex-1">

            <div className={`flex-1 w-full flex sm:flex-col items-center gap-3 border rounded-xl p-4 ${step.bg} transition-transform hover:scale-[1.02]`}>
              <div className={`w-8 h-8 rounded-full ${step.numBg} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                {step.num}
              </div>
              <step.Icon size={22} className={`${step.color} shrink-0 hidden sm:block`} />
              <div className="text-center sm:text-center text-left">
                <p className="font-semibold text-gray-700 text-sm">{step.title}</p>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>

            {/* Ok — son adımda gösterme */}
            {i < STEPS.length - 1 && (
              <ArrowRight size={16} className="text-gray-300 shrink-0 hidden sm:block self-center -mx-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
