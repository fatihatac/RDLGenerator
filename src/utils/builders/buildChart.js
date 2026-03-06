import { DEFAULT_LAYOUT_SETTINGS } from '../../store/useLayoutStore.js';

function buildChart(item, totalHeight, dataSetMap, dataItem, settings = DEFAULT_LAYOUT_SETTINGS) {
  const jsonKeys = dataItem ? dataItem.jsonKeys : [];

  return {
    Chart: {
      '@_Name': `chart-${crypto.randomUUID()}`,
      Left:   `${item._left ?? 0}pt`,
      Top:    `${item._top ?? 0}pt`,
      Height: `${settings.chartHeight}pt`,
      Width:  `${settings.chartWidth}pt`,
      Style: {
        BackgroundColor:           'White',
        FontFamily:                settings.fontFamily,
        FontSize:                  '8pt',
        BackgroundGradientEndColor:'White',
        TextAlign:                 'Center',
        Color:                     'Gray',
        ShadowColor:               'Transparent',
        Border: { Color: '#d3d3d3', Style: 'Solid' },
      },
      DataSetName: dataSetMap
        ? dataSetMap[dataItem.id]
        : `DataSet_${dataItem.id}`,
      ChartSeriesHierarchy: {
        ChartMembers: {
          ChartMember: jsonKeys.map((i) => ({ Label: i })),
        },
      },
      ChartCategoryHierarchy: {
        ChartMembers: [
          {
            ChartMember: {
              Group: { '@_Name': 'Chart_Group1' },
              Label: null,
            },
          },
        ],
      },
      ChartData: {
        ChartSeriesCollection: {
          ChartSeries: jsonKeys.map((key) => ({
            '@_Name': `${key}`,
            ChartDataPoints: {
              ChartDataPoint: {
                ChartDataPointValues: { Y: `=Sum(Fields!${key}.Value)` },
                ChartDataLabel: {
                  Style: {
                    BackgroundGradientEndColor: 'White',
                    Color:       'Black',
                    ShadowColor: 'Transparent',
                    Border: { Color: 'LightGrey', Style: 'None' },
                  },
                  UseValueAsLabel: 'false',
                  Label:    '#PERCENT',
                  Visible:  'false',
                  Position: 'Auto',
                },
                Style: {
                  FontFamily:                settings.fontFamily,
                  FontSize:                  '8pt',
                  BackgroundGradientEndColor:'White',
                  ShadowColor:               'Transparent',
                  Border: { Color: 'Transparent', Style: 'None' },
                },
                ChartMarker: {
                  Size: '6pt',
                  Style: {
                    FontFamily:                settings.fontFamily,
                    FontSize:                  '8pt',
                    BackgroundGradientEndColor:'White',
                    ShadowColor:               'Transparent',
                    Border: { Color: 'Transparent', Style: 'Solid' },
                  },
                },
              },
            },
            Type: 'Shape',
            Style: {
              FontFamily:                settings.fontFamily,
              FontSize:                  '8pt',
              BackgroundGradientEndColor:'White',
              Color:       'Gray',
              ShadowColor: 'Transparent',
              Border: { Color: 'LightGrey', Style: 'Solid' },
            },
            ChartMarker: {
              Size: '6pt',
              Style: {
                FontFamily:                settings.fontFamily,
                FontSize:                  '8pt',
                BackgroundGradientEndColor:'White',
                ShadowColor:               'Transparent',
                Border: { Color: 'Transparent', Style: 'Solid' },
              },
            },
            ValueAxisName:    'Primary',
            CategoryAxisName: 'Primary',
          })),
        },
      },
      ChartAreas: {
        ChartArea: {
          '@_Name': 'Default',
          ChartCategoryAxes: { ChartAxis: buildAxes('Default', settings) },
          ChartValueAxes:    { ChartAxis: buildAxes('Opposite', settings) },
          Style: {
            BackgroundColor:           'White',
            FontFamily:                settings.fontFamily,
            FontSize:                  '8pt',
            BackgroundGradientEndColor:'White',
            TextAlign:   'Center',
            Color:       'Gray',
            ShadowColor: 'Transparent',
            Border: { Color: '#d3d3d3', Style: 'None' },
          },
        },
      },
      ChartLegends: {
        ChartLegend: {
          '@_Name': 'Default',
          Hidden: 'false',
          Style: {
            BackgroundColor:           'White',
            FontFamily:                settings.fontFamily,
            FontSize:                  '8pt',
            BackgroundGradientEndColor:'White',
            TextAlign:   'Center',
            Color:       'Black',
            ShadowColor: 'Transparent',
            Border: { Color: '#d3d3d3', Style: 'None' },
          },
          Position: 'BottomCenter',
          ChartLegendTitle: {
            Caption:        null,
            TitleSeparator: 'None',
            Style: {
              FontFamily:                settings.fontFamily,
              FontSize:                  '8pt',
              FontWeight:                'Bold',
              BackgroundGradientEndColor:'White',
              TextAlign:   'Center',
              Color:       'Gray',
              ShadowColor: 'Transparent',
              Border: { Color: 'LightGrey', Style: 'None' },
            },
          },
          HeaderSeparator:      'None',
          HeaderSeparatorColor: 'Black',
          ColumnSeparator:      'None',
          ColumnSeparatorColor: 'Black',
          ColumnSpacing:        0,
          InterlacedRows:       'false',
          InterlacedRowsColor:  'Transparent',
          EquallySpacedItems:   'false',
          Reversed:             'Auto',
          TextWrapThreshold:    0,
        },
      },
      ChartTitles: {
        ChartTitle: {
          '@_Name': 'Default',
          Caption: 'Chart Title',
          Hidden:  'false',
          Style: {
            FontFamily:                settings.fontFamily,
            FontSize:                  `${settings.titleFontSize}pt`,
            FontWeight:                'Bold',
            BackgroundGradientEndColor:'White',
            TextAlign:    'General',
            VerticalAlign:'Top',
            Color:        'Black',
            ShadowColor:  'Transparent',
            Border: { Width: '0.75000pt', Color: 'LightGrey', Style: 'None' },
          },
          Position:        'TopCenter',
          DockOffset:      0,
          TextOrientation: 'Auto',
        },
      },
      Palette: 'BrightPastel',
      ChartBorderSkin: {
        Style: {
          BackgroundColor:           'White',
          FontFamily:                settings.fontFamily,
          FontSize:                  '8pt',
          BackgroundGradientEndColor:'White',
          TextAlign:   'Center',
          Color:       'White',
          ShadowColor: 'Transparent',
          Border: { Color: '#d3d3d3', Style: 'Solid' },
        },
      },
      ChartNoDataMessage: {
        '@_Name': 'Default',
        Caption: null,
        Hidden:  'false',
        Style: {
          BackgroundColor:           'White',
          FontFamily:                settings.fontFamily,
          FontSize:                  '8pt',
          BackgroundGradientEndColor:'White',
          TextAlign:   'Center',
          Color:       'Gray',
          ShadowColor: 'Transparent',
          Border: { Color: '#d3d3d3', Style: 'Solid' },
        },
        Position:        'TopCenter',
        DockOffset:      0,
        TextOrientation: 'Auto',
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Eksen yapısını inşa eden yardımcı (Primary + Secondary)
// ---------------------------------------------------------------------------
function buildAxes(secondaryLocation, settings) {
  const axisStyle = (borderColor = '#808080') => ({
    BackgroundColor:           'White',
    FontFamily:                settings.fontFamily,
    FontSize:                  '8pt',
    BackgroundGradientEndColor:'White',
    TextAlign:   'Center',
    Color:       'Black',
    ShadowColor: 'Transparent',
    Border: { Color: borderColor, Style: 'Solid' },
  });

  const gridStyle = (borderColor = '#dcdcdc', borderStyle = 'Solid') => ({
    BackgroundColor:           'White',
    FontFamily:                settings.fontFamily,
    FontSize:                  '8pt',
    BackgroundGradientEndColor:'White',
    TextAlign:   'Center',
    Color:       'Gray',
    ShadowColor: 'Transparent',
    Border: { Color: borderColor, Style: borderStyle },
  });

  const tickStyle = () => ({
    FontFamily:                settings.fontFamily,
    FontSize:                  '8pt',
    BackgroundGradientEndColor:'White',
    Color:       'Gray',
    ShadowColor: 'Transparent',
    Border: { Width: '0.75000pt', Color: 'Gray', Style: 'Solid' },
  });

  const scaleBreakStyle = () => ({
    BackgroundColor:           'White',
    FontFamily:                settings.fontFamily,
    FontSize:                  '8pt',
    BackgroundGradientEndColor:'White',
    TextAlign:   'Center',
    Color:       'Gray',
    ShadowColor: 'Transparent',
    Border: { Color: '#d3d3d3', Style: 'Solid' },
  });

  const buildAxis = (name, location) => ({
    '@_Name': name,
    Visible: 'Auto',
    Style:   axisStyle(),
    ChartAxisTitle: {
      Caption:  null,
      Position: 'Center',
      Style:    axisStyle('#d3d3d3'),
    },
    Interval: 0,
    ChartMajorGridLines: { Enabled: 'Auto', Style: gridStyle(),           IntervalType: 'Default', IntervalOffsetType: 'Default' },
    ChartMinorGridLines: { Enabled: 'Auto', Style: gridStyle('#dcdcdc','Dotted'), IntervalType: 'Default', IntervalOffsetType: 'Default' },
    ChartMajorTickMarks: { Enabled: 'false', Type: 'Outside', Style: tickStyle(), Length: 1.5, IntervalType: 'Default', IntervalOffsetType: 'Default' },
    ChartMinorTickMarks: { Enabled: 'false', Type: 'Outside', Style: tickStyle(), Length: 1,   IntervalType: 'Default', IntervalOffsetType: 'Default' },
    Location:            location,
    InterlacedColor:     'Transparent',
    LabelsAutoFitDisabled:'True',
    ChartAxisScaleBreak: {
      Enabled: 'false', BreakLineType: 'Ragged',
      CollapsibleSpaceThreshold: 25, MaxNumberOfBreaks: 2,
      Spacing: 0, IncludeZero: 'Auto',
      Style: scaleBreakStyle(),
    },
  });

  return [
    buildAxis('Primary',   'Default'),
    buildAxis('Secondary', secondaryLocation),
  ];
}

export default buildChart;
