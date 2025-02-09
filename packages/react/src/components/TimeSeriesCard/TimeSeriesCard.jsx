import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LineChart, StackedBarChart } from '@carbon/charts-react';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import capitalize from 'lodash/capitalize';
import defaultsDeep from 'lodash/defaultsDeep';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import {
  CardPropTypes,
  ZoomBarPropTypes,
  TruncationPropTypes,
} from '../../constants/CardPropTypes';
import {
  CARD_SIZES,
  TIME_SERIES_TYPES,
  ZOOM_BAR_ENABLED_CARD_SIZES,
} from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import StatefulTable from '../Table/StatefulTable';
import { settings } from '../../constants/Settings';
import {
  getUpdatedCardSize,
  handleCardVariables,
  chartValueFormatter,
  getResizeHandles,
  handleTooltip,
} from '../../utils/cardUtilityFunctions';
import deprecate from '../../internal/deprecate';
import dayjs from '../../utils/dayjs';

import {
  generateSampleValues,
  formatGraphTick,
  formatColors,
  formatChartData,
  applyStrokeColor,
  applyFillColor,
  applyIsFilled,
} from './timeSeriesUtils';

const { iotPrefix } = settings;

const TimeSeriesDatasetPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  /** the attribute in values to map to */
  dataSourceId: PropTypes.string.isRequired,
  /** optional filter to apply to this particular line */
  dataFilter: PropTypes.objectOf(PropTypes.any),
  /** optional param to set the colors */
  color: PropTypes.string,
});

const TimeSeriesCardPropTypes = {
  content: PropTypes.shape({
    series: PropTypes.oneOfType([
      TimeSeriesDatasetPropTypes,
      PropTypes.arrayOf(TimeSeriesDatasetPropTypes),
    ]).isRequired,
    /** Custom X-axis label */
    xLabel: PropTypes.string,
    /** Custom Y-axis label */
    yLabel: PropTypes.string,
    /** the number of decimals to show in the legend and on the y-axis */
    decimalPrecision: PropTypes.number,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnXaxis: PropTypes.bool,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnYaxis: PropTypes.bool,
    /** Which attribute is the time attribute i.e. 'timestamp' */
    timeDataSourceId: PropTypes.string,
    /** should it be a line chart or bar chart, default is line chart */
    chartType: deprecate(
      PropTypes.oneOf(Object.values(TIME_SERIES_TYPES)),
      '\nThe prop `chartType` for Card has been deprecated. BarChartCard now handles all bar chart functionality including time-based bar charts.'
    ),
    /** optional units to put in the legend */
    unit: PropTypes.string,
    /** Optionally adds a zoom bar to the chart */
    zoomBar: ZoomBarPropTypes,
    /** Number of grid-line spaces to the left and right of the chart to add white space to. Defaults to 1 */
    addSpaceOnEdges: PropTypes.number,
    /** whether or not to show a legend at the bottom of the card
     * if not explicitly stated, the card will show based on the length of the series
     */
    showLegend: PropTypes.bool,
    /** Where to place the chart legend */
    legendPosition: PropTypes.string,
    /** carbon charts legend truncation options */
    truncation: TruncationPropTypes,
  }).isRequired,
  i18n: PropTypes.shape({
    alertDetected: PropTypes.string,
    noData: PropTypes.string,
    tooltipGroupLabel: PropTypes.string,
    defaultFilterStringPlaceholdText: PropTypes.string,
  }),
  /** array of data from the backend for instance [{timestamp: Date object || ms timestamp, temperature: 35, humidity: 10}, ...] */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
  cardVariables: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.number, PropTypes.bool])
  ),
  /** Interval for time series configuration used for formatting the x-axis */
  interval: PropTypes.oneOf(['minute', 'hour', 'day', 'week', 'quarter', 'month', 'year']),
  /** optional domain to graph from. First value is the beginning of the range. Second value is the end of the range
   * can be date instance or timestamp
   */
  domainRange: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.object])),
  /** Region for value and text formatting */
  locale: PropTypes.string,
  /** Show timestamp in browser local time or GMT */
  showTimeInGMT: PropTypes.bool,
  /** tooltip format pattern that follows the dayjs formatting patterns */
  tooltipDateFormatPattern: PropTypes.string,
};

const defaultProps = {
  size: CARD_SIZES.MEDIUM,
  values: [],
  i18n: {
    alertDetected: 'Alert detected:',
    noDataLabel: 'No data is available for this time range.',
    tooltipGroupLabel: 'Group',
    defaultFilterStringPlaceholdText: 'Filter',
  },
  chartType: TIME_SERIES_TYPES.LINE,
  locale: 'en',
  content: {
    series: [],
    timeDataSourceId: 'timestamp',
    includeZeroOnXaxis: false,
    includeZeroOnYaxis: false,
    showLegend: true,
    legendPosition: 'bottom',
    truncation: {
      type: 'end_line',
      threshold: 20,
      numCharacter: 20,
    },
  },
  interval: 'hour',
  showTimeInGMT: false,
  domainRange: null,
  tooltipDateFormatPattern: 'L HH:mm:ss',
};

const TimeSeriesCard = ({
  title: titleProp,
  content,
  children,
  size,
  interval,
  isEditable,
  isResizable,
  values: initialValues,
  locale,
  i18n,
  isExpanded,
  timeRange,
  isLazyLoading,
  isLoading,
  domainRange,
  tooltipDateFormatPattern,
  showTimeInGMT,
  ...others
}) => {
  // need to deep merge the nested content default props as default props only uses a shallow merge natively
  const contentWithDefaults = useMemo(() => defaultsDeep({}, content, defaultProps.content), [
    content,
  ]);
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const {
    title,
    content: {
      series,
      timeDataSourceId,
      alertRanges,
      xLabel,
      yLabel,
      includeZeroOnXaxis,
      includeZeroOnYaxis,
      decimalPrecision,
      unit,
      chartType,
      zoomBar,
      showLegend,
      legendPosition,
      addSpaceOnEdges,
      truncation,
    },
    values: valuesProp,
  } = handleCardVariables(titleProp, contentWithDefaults, initialValues, others);
  let chartRef = useRef();
  const previousTick = useRef();
  dayjs.locale(locale);

  const sampleValues = useMemo(
    () => generateSampleValues(series, timeDataSourceId, interval, timeRange),
    [series, timeDataSourceId, interval, timeRange]
  );

  const values = useMemo(() => (isEditable ? sampleValues : valuesProp), [
    isEditable,
    sampleValues,
    valuesProp,
  ]);

  // Unfortunately the API returns the data out of order sometimes
  const valueSort = useMemo(
    () =>
      values.sort((left, right) =>
        dayjs.utc(left[timeDataSourceId]).diff(dayjs.utc(right[timeDataSourceId]))
      ),
    [values, timeDataSourceId]
  );

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = useMemo(() => getUpdatedCardSize(size), [size]);

  const maxTicksPerSize = useMemo(() => {
    switch (newSize) {
      case CARD_SIZES.MEDIUMTHIN:
        return 2;
      case CARD_SIZES.MEDIUM:
        return 4;
      case CARD_SIZES.MEDIUMWIDE:
      case CARD_SIZES.LARGE:
      case CARD_SIZES.LARGETHIN:
        return 6;
      case CARD_SIZES.LARGEWIDE:
        return 14;
      default:
        return 10;
    }
  }, [newSize]);

  const formatTick = useCallback(
    /** *
     * timestamp of current value
     * index of current value
     * ticks: array of current ticks
     */
    (timestamp, index, ticks) => {
      const previousTimestamp = previousTick.current;
      // store current in the previous tick
      previousTick.current = timestamp;
      return formatGraphTick(
        timestamp,
        index,
        ticks,
        interval,
        locale,
        previousTimestamp,
        showTimeInGMT
      );
    },
    [interval, locale, showTimeInGMT]
  );

  // Set the colors for each dataset
  const colors = useMemo(() => formatColors(series), [series]);

  /** This is needed to update the chart when the lines and values change */
  useDeepCompareEffect(() => {
    if (chartRef && chartRef.chart) {
      const chartData = formatChartData(timeDataSourceId, series, valueSort);
      chartRef.chart.model.setData(chartData);
    }
  }, [valueSort, series, timeDataSourceId]);

  /** This caches the chart value */
  const chartData = useMemo(() => formatChartData(timeDataSourceId, series, valueSort), [
    timeDataSourceId,
    series,
    valueSort,
  ]);

  const isChartDataEmpty = isEmpty(chartData);

  const { tableData, columnNames } = useMemo(() => {
    let maxColumnNames = [];

    const tableValues = valueSort.map((value, index) => {
      const currentValueColumns = Object.keys(omit(value, timeDataSourceId));
      maxColumnNames =
        currentValueColumns.length > maxColumnNames.length ? currentValueColumns : maxColumnNames;
      return {
        id: `dataindex-${index}`,
        values: {
          ...omit(value, timeDataSourceId), // skip the timestamp so we can format it locally
          [timeDataSourceId]: dayjs(value[timeDataSourceId]).format('L HH:mm'),
        },
        isSelectable: false,
      };
    });
    return { tableData: tableValues, columnNames: maxColumnNames };
  }, [timeDataSourceId, valueSort]);

  // In expanded mode we show the data underneath the linechart in a table so need to build the columns
  const tableColumns = useMemo(() => {
    // First column is timestamp
    const columns = [
      {
        id: timeDataSourceId,
        name: capitalize(timeDataSourceId),
        isSortable: true,
        type: 'TIMESTAMP',
      },
    ];
    // then the rest in series order
    return columns.concat(
      columnNames.map((columnName) => {
        const matchingDataSource = Array.isArray(series)
          ? series.find((d) => d.dataSourceId === columnName)
          : series;
        return {
          id: columnName,
          // use the label if one exists as it will be the user-defined, readable name
          // UNLESS dataFilter is enabled as the matchingDataSource will only find the first match
          name: matchingDataSource
            ? matchingDataSource.dataFilter
              ? matchingDataSource.dataSourceId
              : matchingDataSource.label
            : columnName,
          isSortable: true,
          filter: { placeholderText: mergedI18n.defaultFilterStringPlaceholdText },
          renderDataFunction: ({ value }) => {
            if (typeof value === 'number' && !isNil(decimalPrecision)) {
              return chartValueFormatter(value, size, unit, locale, decimalPrecision);
            }
            return value;
          },
        };
      })
    );
  }, [
    columnNames,
    decimalPrecision,
    mergedI18n.defaultFilterStringPlaceholdText,
    locale,
    series,
    size,
    timeDataSourceId,
    unit,
  ]);

  // TODO: remove in next release
  const ChartComponent = chartType === TIME_SERIES_TYPES.BAR ? StackedBarChart : LineChart;

  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  const handleStrokeColor = useMemo(() => applyStrokeColor(alertRanges), [alertRanges]);
  const handleFillColor = useMemo(() => applyFillColor(alertRanges), [alertRanges]);
  const handleIsFilled = useMemo(() => applyIsFilled(alertRanges), [alertRanges]);

  const options = useMemo(
    () => ({
      animations: false,
      accessibility: false,
      axes: {
        bottom: {
          title: xLabel || ' ',
          mapsTo: 'date',
          scaleType: 'time',
          ticks: {
            number: maxTicksPerSize,
            formatter: formatTick,
          },
          includeZero: includeZeroOnXaxis,
          ...(domainRange ? { domain: domainRange } : {}),
        },
        left: {
          title: `${yLabel || ''} ${unit ? `(${unit})` : ''}`,
          mapsTo: 'value',
          ticks: {
            formatter: (axisValue) =>
              chartValueFormatter(axisValue, newSize, null, locale, decimalPrecision),
          },
          ...(chartType !== TIME_SERIES_TYPES.BAR
            ? { yMaxAdjuster: (yMaxValue) => yMaxValue * 1.3 }
            : {}),
          stacked: chartType === TIME_SERIES_TYPES.BAR && series.length > 1,
          includeZero: includeZeroOnYaxis,
          scaleType: 'linear',
        },
      },
      legend: {
        position: legendPosition,
        clickable: !isEditable,
        enabled: showLegend ?? series.length > 1,
        truncation,
      },
      containerResizable: true,
      tooltip: {
        valueFormatter: (tooltipValue) =>
          chartValueFormatter(tooltipValue, newSize, unit, locale, decimalPrecision),
        customHTML: (...args) =>
          handleTooltip(
            ...args,
            alertRanges,
            mergedI18n.alertDetected,
            showTimeInGMT,
            tooltipDateFormatPattern
          ),
        groupLabel: mergedI18n.tooltipGroupLabel,
      },
      getStrokeColor: handleStrokeColor,
      getFillColor: handleFillColor,
      getIsFilled: handleIsFilled,
      color: colors,
      ...(zoomBar?.enabled && (ZOOM_BAR_ENABLED_CARD_SIZES.includes(size) || isExpanded)
        ? {
            zoomBar: {
              // [zoomBar.axes]: {    TODO: the top axis is the only axis supported at the moment so default to top
              top: {
                enabled: zoomBar.enabled,
                initialZoomDomain: zoomBar.initialZoomDomain,
                type: zoomBar.view || 'slider_view', // default to slider view
              },
            },
          }
        : {}),
      timeScale: {
        addSpaceOnEdges: !isNil(addSpaceOnEdges) ? addSpaceOnEdges : 1,
      },
    }),
    [
      xLabel,
      maxTicksPerSize,
      formatTick,
      includeZeroOnXaxis,
      domainRange,
      yLabel,
      unit,
      chartType,
      series.length,
      includeZeroOnYaxis,
      legendPosition,
      isEditable,
      showLegend,
      truncation,
      mergedI18n.tooltipGroupLabel,
      mergedI18n.alertDetected,
      handleStrokeColor,
      handleFillColor,
      handleIsFilled,
      colors,
      zoomBar,
      size,
      isExpanded,
      addSpaceOnEdges,
      newSize,
      locale,
      decimalPrecision,
      alertRanges,
      showTimeInGMT,
      tooltipDateFormatPattern,
    ]
  );

  return (
    <Card
      title={title}
      size={newSize}
      i18n={mergedI18n}
      timeRange={timeRange}
      {...others}
      isExpanded={isExpanded}
      isEditable={isEditable}
      isEmpty={isChartDataEmpty}
      isLazyLoading={isLazyLoading || (valueSort && valueSort.length > 200)}
      isLoading={isLoading}
      resizeHandles={resizeHandles}
    >
      {!isChartDataEmpty ? (
        <>
          <div
            className={classNames(`${iotPrefix}--time-series-card--wrapper`, {
              [`${iotPrefix}--time-series-card--wrapper__expanded`]: isExpanded,
              [`${iotPrefix}--time-series-card--wrapper__lots-of-points`]:
                valueSort && valueSort.length > 50,
              [`${iotPrefix}--time-series-card--wrapper__editable`]: isEditable,
            })}
          >
            <ChartComponent
              ref={(el) => {
                chartRef = el;
              }}
              data={chartData}
              options={options}
              width="100%"
              height="100%"
            />
          </div>
          {isExpanded ? (
            <StatefulTable
              id="TimeSeries-table"
              className={`${iotPrefix}--time-series-card--stateful-table`}
              columns={tableColumns}
              data={tableData}
              options={{
                hasPagination: true,
                hasSearch: true,
                hasFilter: true,
              }}
              actions={{
                toolbar: {
                  onDownloadCSV: (filteredData) => csvDownloadHandler(filteredData, title),
                },
              }}
              view={{
                pagination: {
                  pageSize: 10,
                  pageSizes: [10, 20, 30],
                },
                toolbar: {
                  activeBar: null,
                },
                filters: [],
                table: {
                  sort: {
                    columnId: timeDataSourceId,
                    direction: 'DESC',
                  },
                  emptyState: {
                    message: mergedI18n.noDataLabel,
                  },
                },
              }}
              i18n={mergedI18n}
            />
          ) : null}
        </>
      ) : null}
    </Card>
  );
};

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };
TimeSeriesCard.defaultProps = defaultProps;

export default TimeSeriesCard;
