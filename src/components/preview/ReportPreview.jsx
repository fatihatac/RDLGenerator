import { useMemo } from 'react';
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
} from './blocks';

function ReportPreview() {
  const { reportItems, isPortrait, setIsPortrait, reportType } = useReportStore(
    useShallow((state) => ({
      reportItems: state.reportItems,
      isPortrait: state.isPortrait,
      setIsPortrait: state.setIsPortrait,
      reportType: state.reportType,
    })),
  );

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

  const isEmpty = reportItems.length === 0;
  const isFormType = reportType !== REPORT_TYPES.STANDARD;

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
      </div>

      <Page isPortrait={isPortrait}>
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
          reportItems.map((item) => {
            if (item.type === ITEM_TYPES.DATA) return null;
            if (item.type === ITEM_TYPES.TITLE)
              return <TitleBlock key={item.id} value={item.value} />;
            if (item.type === ITEM_TYPES.DATE_RANGE)
              return <DateRangeBlock key={item.id} />;
            if (item.type === ITEM_TYPES.TABLE)
              return <DataTableBlock key={item.id} tableItem={item} rows={firstDataRows} />;
            if (item.type === ITEM_TYPES.CHART)
              return <ChartPlaceholder key={item.id} item={item} />;
            return null;
          })
        )}
      </Page>
    </div>
  );
}

export default ReportPreview;
