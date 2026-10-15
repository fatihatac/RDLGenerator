import { useMemo, useState } from 'react';
import useReportStore from '../../store/useReportStore';
import { useShallow } from 'zustand/react/shallow';
import { ITEM_TYPES } from '../../constants/appConstants';
import { REPORT_TYPES } from '../../constants/reportTypes';
import { parseAndFlattenData } from '../../utils/preview/dataUtils';
import {
  Page,
  TitleBlock,
  DateRangeBlock,
  DataTableBlock,
  ChartPlaceholder,
  GenericDataTableBlock,
  EmptyState,
  MatrixBlock,
  PositionedCanvas,
} from './blocks';
import useLayoutStore from '../../store/useLayoutStore';
import useItemPositions from '../../hooks/useItemPositions';

function ReportPreview() {
  const { reportItems, reportType } = useReportStore(
    useShallow((state) => ({
      reportItems: state.reportItems,
      reportType: state.reportType,
    })),
  );
  const updateLayoutSetting = useLayoutStore((s) => s.updateLayoutSetting);
  // Normal önizleme (RDL görüntüleyici / tasarım ekranı gibi) bileşenleri 0,0'dan başlatır;
  // Baskı önizleme sayfa marjinini uygular (PDF/yazıcı çıktısı gibi).
  const [printMode, setPrintMode] = useState(false);

  const dataMap = useMemo(() => {
    const map = {};
    reportItems.forEach((item) => {
      if (item.type === ITEM_TYPES.DATA) {
        map[item.id] = parseAndFlattenData(item.value);
      }
    });
    return map;
  }, [reportItems]);

  const firstDataItem = reportItems.find((i) => i.type === ITEM_TYPES.DATA);
  const firstDataRows = firstDataItem ? (dataMap[firstDataItem.id] ?? []) : [];

  const { byId, contentWidth, bodyHeight, overlaps, settings, pageWidth, pageHeight } = useItemPositions();

  // Yön, RDL'deki gerçek sayfa ölçüsünden türetilir; değiştirmek ölçüleri yer değiştirir.
  const isPortrait = settings.pageHeight >= settings.pageWidth;
  const setIsPortrait = (portrait) => {
    if (portrait === isPortrait) return;
    updateLayoutSetting('pageWidth', settings.pageHeight);
    updateLayoutSetting('pageHeight', settings.pageWidth);
  };

  const isEmpty = reportItems.length === 0;
  const isFormType = reportType !== REPORT_TYPES.STANDARD;

  const renderBlock = (item) => {
    switch (item.type) {
      case ITEM_TYPES.TITLE:
        return <TitleBlock value={item.value} />;
      case ITEM_TYPES.DATE_RANGE:
        return <DateRangeBlock />;
      case ITEM_TYPES.TABLE:
        return <DataTableBlock tableItem={item} rows={firstDataRows} />;
      case ITEM_TYPES.CHART:
        return <ChartPlaceholder item={item} height={byId[item.id]?._height} />;
      case ITEM_TYPES.MATRIX:
        return <MatrixBlock item={item} />;
      default:
        return null;
    }
  };

  const positionedBlocks = reportItems
    .map((item) => ({ pos: byId[item.id], node: renderBlock(item) }))
    .filter(({ pos, node }) => pos && node);
  const pagePadding = printMode
    ? `${settings.marginTop}pt ${settings.marginRight}pt ${settings.marginBottom}pt ${settings.marginLeft}pt`
    : '0pt';

  return (
    <div className="flex flex-col items-center w-full gap-6 pb-12">
      <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 self-center">
        <span className="text-sm font-medium text-gray-600 mr-3">Kağıt Yönü:</span>
        <div className="flex bg-gray-100 p-0.5 rounded-md">
          {[
            { label: 'Dikey (Portrait)', val: true },
            { label: 'Yatay (Landscape)', val: false },
          ].map(({ label, val }) => (
            <button
              key={String(val)}
              onClick={() => setIsPortrait(val)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                isPortrait === val
                  ? 'bg-white shadow text-[#e12f27]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-600 mx-3 pl-3 border-l border-gray-200">Görünüm:</span>
        <div className="flex bg-gray-100 p-0.5 rounded-md">
          {[
            { label: 'Önizleme (0,0)', val: false },
            { label: 'Baskı önizleme (marjinli)', val: true },
          ].map(({ label, val }) => (
            <button
              key={String(val)}
              onClick={() => setPrintMode(val)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                printMode === val
                  ? 'bg-white shadow text-[#e12f27]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Page width={pageWidth} height={pageHeight} padding={pagePadding}>
        {isEmpty ? (
          <EmptyState />
        ) : isFormType ? (
          <>
            {reportItems
              .filter((i) => i.type === ITEM_TYPES.TITLE)
              .map((item) => (
                <TitleBlock key={item.id} value={item.value} />
              ))}
            {reportItems
              .filter((i) => i.type === ITEM_TYPES.DATA)
              .map((item) => (
                <GenericDataTableBlock key={item.id} rows={dataMap[item.id] ?? []} />
              ))}
          </>
        ) : (
          <PositionedCanvas
            contentWidth={contentWidth}
            bodyHeight={bodyHeight}
            items={positionedBlocks.map(({ pos }) => pos)}
            overlaps={overlaps}
          >
            {positionedBlocks}
          </PositionedCanvas>
        )}
      </Page>
    </div>
  );
}

export default ReportPreview;
