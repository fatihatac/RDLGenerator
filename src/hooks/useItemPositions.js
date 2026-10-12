import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useReportStore from '../store/useReportStore';
import useLayoutStore from '../store/useLayoutStore';
import { REPORT_TYPES } from '../constants/reportTypes';
import {
  calculateReportValues,
  computePositions,
  detectOverlaps,
  applyPageMargins,
} from '../utils/core/reportCalculations';

// pdy00146 generator'ındaki LEGEND_WIDTH ile aynı olmalı
const PDY00146_LEGEND_WIDTH = 1062.75;

/**
 * Önizleme, PositionEditor ve RDL generator'ın aynı hesabı kullanması için
 * tek kaynak: her itemın _left/_top/_width/_height değeri, içerik genişliği
 * ve kesişen itemlar.
 */
export default function useItemPositions() {
  const { reportItems, reportType } = useReportStore(
    useShallow((s) => ({ reportItems: s.reportItems, reportType: s.reportType })),
  );
  const settings = useLayoutStore((s) => s.layoutSettings);

  return useMemo(() => {
    const { TOTAL_REPORT_WIDTH } = calculateReportValues(reportItems, settings);
    const contentWidth =
      reportType === REPORT_TYPES.PDY00146
        ? Math.max(TOTAL_REPORT_WIDTH, PDY00146_LEGEND_WIDTH)
        : TOTAL_REPORT_WIDTH;

    const positioned = computePositions(reportItems, settings, contentWidth);
    const byId = Object.fromEntries(positioned.map((p) => [p.id, p]));
    // Çakışma, marjin dahil mutlak sayfa koordinatlarında bakılır (kağıt-kenarı öğeleri dahil).
    const overlaps = detectOverlaps(
      applyPageMargins(positioned, settings).filter((p) => !p.section || p.section === 'body'),
    );

    // RDL'deki sayfa ölçüsü: pdy00146 genişliği içerik + yan boşluklardan türetir
    const pageWidth =
      reportType === REPORT_TYPES.PDY00146
        ? contentWidth + settings.marginLeft + settings.marginRight
        : settings.pageWidth;

    return {
      byId, positioned, contentWidth, overlaps, settings,
      pageWidth, pageHeight: settings.pageHeight,
    };
  }, [reportItems, reportType, settings]);
}
