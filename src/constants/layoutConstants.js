// ---------------------------------------------------------------------------
// layoutConstants.js
// Bu dosya artık yalnızca REFERANS sabitleri içerir.
// Builder'lar bu sabitlerden OKUMAZ; bunun yerine useLayoutStore'dan alınan
// settings objesini parametre olarak kullanır.
// DEFAULT_LAYOUT_SETTINGS useLayoutStore.js içinde tanımlıdır.
// ---------------------------------------------------------------------------

const TITLE_HEIGHT             = 49.5;
const TITLE_FONT_SIZE          = 10.5;
const TITLE_FONT_WEIGHT        = 'Bold';
const COLUMN_WIDTH             = 72;
const COLUMN_HEIGHT            = 18.6;
const COLUMN_HEADER_FONT_SIZE  = 10;
const COLUMN_DATA_FONT_SIZE    = 7.5;
const COLUMN_TEXT_HORIZONTAL_ALIGN = 'Left';
const COLUMN_TEXT_VERTICAL_ALIGN   = 'Middle';
const TITLE_TEXT_HORIZONTAL_ALIGN  = 'Center';
const TITLE_TEXT_VERTICAL_ALIGN    = 'Middle';
const TABLE_HEIGHT             = 37.50011;
const CHART_HEIGHT             = 216;
const CHART_WIDTH              = 288;
const PAGE_HEIGHT              = 501;
const FONT_FAMILY              = 'Segoe UI';
const PADDING                  = 10;
const DEFAULT_REPORT_HEIGHT    = 375.75;

const PAPER_DIMENSIONS = {
  PORTRAIT: {
    width:   '210mm',
    height:  '297mm',
    maxRows: 28,
  },
  LANDSCAPE: {
    width:   '297mm',
    height:  '210mm',
    maxRows: 12,
  },
};

const PAPER_STYLES = {
  padding:    '20mm',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
};

export {
  COLUMN_DATA_FONT_SIZE,
  COLUMN_HEADER_FONT_SIZE,
  COLUMN_HEIGHT,
  COLUMN_TEXT_HORIZONTAL_ALIGN,
  COLUMN_TEXT_VERTICAL_ALIGN,
  COLUMN_WIDTH,
  PAGE_HEIGHT,
  TABLE_HEIGHT,
  TITLE_FONT_SIZE,
  TITLE_FONT_WEIGHT,
  TITLE_HEIGHT,
  TITLE_TEXT_HORIZONTAL_ALIGN,
  TITLE_TEXT_VERTICAL_ALIGN,
  FONT_FAMILY,
  PADDING,
  CHART_HEIGHT,
  CHART_WIDTH,
  PAPER_DIMENSIONS,
  PAPER_STYLES,
  DEFAULT_REPORT_HEIGHT,
};
