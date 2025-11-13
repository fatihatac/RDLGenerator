import { Trash2, FileText, Link, CheckSquare } from 'lucide-react';

function JSONEditor({ item, updateItem, deleteItem, tableItem, onUpdateTableColumnMapping }) {
    const handleJsonChange = (e) => {
        const jsonString = e.target.value;
        let keys = [];
        try {
            // JSON'u parse etmeyi dene
            const parsedValue = JSON.parse(jsonString);
            // JSON bir dizi ise ilk öğenin anahtarlarını al
            if (Array.isArray(parsedValue) && parsedValue.length > 0) {
                keys = Object.keys(parsedValue[0]);
            }
            // JSON tek bir nesne ise doğrudan anahtarlarını al
            else if (typeof parsedValue === 'object' && parsedValue !== null && !Array.isArray(parsedValue)) {
                keys = Object.keys(parsedValue);
            }
        } catch (error) {
            console.log(error);

            keys = [];
        }
        // Kendi state'ini güncelle (dataItem)
        updateItem(item.id, { value: jsonString, jsonKeys: keys });
    };

    // Eşleştirme UI'ını gösterip göstermeyeceğimizi belirleyen kontrol
    const showMappingUI =
        tableItem &&
        tableItem.columns.length > 0 &&
        item.jsonKeys &&
        item.jsonKeys.length > 0;

    const handleConfirmClick = () => {
        console.log("Eşleştirmeler state'e kaydedildi:", tableItem.columns);
        alert("Eşleştirmeler kaydedildi!");
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-yellow-600 font-semibold">
                    <FileText size={18} className="mr-2" />
                    <span>JSON Veri Kaynağı</span>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={18} />
                </button>
            </div>

            {/* 1. JSON Veri Giriş Alanı */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">JSON Verisi (Dizi formatında)</label>
                <textarea
                    value={item.value}
                    onChange={handleJsonChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    rows={5}
                    placeholder="Örn: [{ &quot;isim&quot;: &quot;Ahmet&quot;, &quot;yas&quot;: 30 }]"
                />
                {item.jsonKeys && item.jsonKeys.length > 0 && (
                    <div className="text-xs text-gray-500 pt-1">
                        <span className="font-medium">Bulunan Alanlar:</span> {item.jsonKeys.join(', ')}
                    </div>
                )}
            </div>

            {/* 2. Veri Eşleştirme Alanı */}
            {showMappingUI && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Link size={18} className="mr-2 text-blue-600" />
                        Veri Eşleştirme
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Tablo sütunlarınız ile JSON veri alanlarınızı eşleştirin.
                    </p>

                    <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-3">
                        {/* Başlık Satırı */}
                        <div className="grid grid-cols-12 items-center gap-2 mb-1 px-1">
                            <label className="col-span-5 text-xs font-bold text-gray-500 uppercase">TABLO SÜTUNU</label>
                            <div className="col-span-2"></div>
                            <label className="col-span-5 text-xs font-bold text-gray-500 uppercase">JSON ALANI</label>
                        </div>

                        {/* Eşleştirme Satırları */}
                        {tableItem.columns.map((col) => (
                            <div key={col.id} className="grid grid-cols-12 items-center gap-2">

                                {/* Rapor Sütun Adı (Değiştirilemez) */}
                                <div className="col-span-5 p-1.5 text-sm bg-gray-100 border border-gray-200 rounded text-gray-700 truncate" title={col.name}>
                                    {col.name}
                                </div>

                                {/* Ayırıcı İkon */}
                                <div className="col-span-2 text-center text-gray-400">
                                    <Link size={14} />
                                </div>

                                {/* JSON Alanı Seçim Combobox'ı */}
                                <select
                                    value={col.mappedField || ''}
                                    // Seçim değiştiğinde, MainPanel'deki handler'ı tetikler
                                    onChange={(e) => onUpdateTableColumnMapping(col.id, e.target.value)}
                                    className="col-span-5 p-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                                >
                                    <option value="">-- Eşleştir --</option>
                                    {/* Liste JSON'dan gelen 'jsonKeys' ile dolar */}
                                    {item.jsonKeys.map(key => (
                                        <option key={key} value={key}>{key}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Onay Butonu */}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleConfirmClick}
                            className="text-sm flex items-center bg-green-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <CheckSquare size={16} className="mr-2" />
                            Eşleştirmeyi Onayla
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JSONEditor;