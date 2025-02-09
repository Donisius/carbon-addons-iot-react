import React, { useMemo, useCallback } from 'react';
import { OverflowMenu, OverflowMenuItem, Link } from 'carbon-components-react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import capitalize from 'lodash/capitalize';
import { OverflowMenuVertical16 } from '@carbon/icons-react';
import { spacing01, spacing05 } from '@carbon/layout';

import dayjs from '../../utils/dayjs';
import { CardPropTypes, TableCardPropTypes } from '../../constants/CardPropTypes';
import Card, { defaultProps as CardDefaultProps } from '../Card/Card';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import StatefulTable from '../Table/StatefulTable';
import { generateTableSampleValues } from '../TimeSeriesCard/timeSeriesUtils';
import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import CardToolbar from '../Card/CardToolbar';
import { settings } from '../../constants/Settings';
import {
  getUpdatedCardSize,
  handleCardVariables,
  getResizeHandles,
  findMatchingThresholds,
} from '../../utils/cardUtilityFunctions';
import icons from '../../utils/bundledIcons';

import {
  createColumnsWithFormattedLinks,
  determinePrecisionAndValue,
  handleExpandedItemLinks,
} from './tableCardUtils';
import ThresholdIcon from './ThresholdIcon';

const { iotPrefix } = settings;

const StyledStatefulTable = styled(({ showHeader, isExpanded, data, ...rest }) => (
  <StatefulTable {...rest} data={data} />
))`
  flex: inherit;
  height: 100%;
  position: relative;
  overflow-y: ${(props) => (!props.isExpanded ? 'hidden' : 'auto')};
  padding-bottom: ${(props) => (props.isExpanded ? '3rem' : '')};
  &&& {
    .bx--pagination {
      position: ${(props) => (!props.isExpanded ? 'absolute' : 'fixed')};
      bottom: ${(props) => (!props.isExpanded ? '0px' : '25px')};
      ${(props) => (props.isExpanded ? `width: calc(100% - 50px)` : ``)}
    }
    .bx--data-table-container {
      ${(props) =>
        props.data && props.data.length > 0 && !props.isExpanded
          ? `max-height: 435px;`
          : `height: 90%;`}
    }

    .bx--list-box__menu-item {
      height: 2rem;
      font-weight: normal;
    }

    .bx--table-toolbar {
      padding-bottom: ${spacing01};
      padding-top: 0px;
    }
    .bx--data-table th:first-of-type,
    .bx--data-table td:first-of-type {
      padding-left: ${spacing05};
      padding-right: ${spacing05};
    }
    .bx--data-table thead {
      display: ${(props) => (!props.showHeader ? 'none' : '')};
      tr {
        height: 2rem;
      }
    }

    .bx--data-table tbody tr {
      height: 2.5rem;
    }
    .bx--data-table-container + .bx--pagination {
      border: 1px solid #dfe3e6;
    }

    .bx--toolbar-search-container {
      margin-left: ${spacing05};
    }
    .bx--data-table {
      ${(props) => (props.data && props.data.length > 0 ? `height: initial;` : `height: 100%;`)}
      td {
        white-space: nowrap;
      }
    }
    .bx--data-table thead tr:nth-child(2) {
      height: 3rem;

      th {
        padding-top: 5px;
        padding-bottom: 10px;

        input {
          height: 2rem;
        }
      }
      th div.bx--form-item {
        display: block;
        .bx--list-box {
          height: auto;
        }
      }
      th div.bx--list-box {
        height: 2rem;
      }
    }
  }
`;

const defaultProps = {
  size: CARD_SIZES.LARGE,
  locale: 'en',
  values: [],
  i18n: {
    criticalLabel: 'Critical',
    moderateLabel: 'Moderate',
    lowLabel: 'Low',
    selectSeverityPlaceholder: 'Select a severity',
    searchPlaceholder: 'Search',
    filterButtonAria: 'Filters',
    defaultFilterStringPlaceholdText: 'Type and hit enter to apply',
    downloadIconDescription: 'Download table content',
    severityLabel: 'Severity',
    emptyMessage: 'There is no data for this time range.',
    // Card-specific labels needed for combo with table toolbar
    last24HoursLabel: 'Last 24 hrs',
    last7DaysLabel: 'Last 7 days',
    lastMonthLabel: 'Last month',
    lastQuarterLabel: 'Last quarter',
    lastYearLabel: 'Last year',
    periodToDateLabel: 'Period to date',
    thisWeekLabel: 'This week',
    thisMonthLabel: 'This month',
    thisQuarterLabel: 'This quarter',
    thisYearLabel: 'This year',
    hourlyLabel: 'Hourly',
    dailyLabel: 'Daily',
    weeklyLabel: 'Weekly',
    monthlyLabel: 'Monthly',
    defaultLabel: 'Default',
    closeLabel: 'Close',
    expandLabel: 'Expand to fullscreen',
  },
};

const TableCard = ({
  id,
  title: titleProp,
  isExpanded,
  content: contentProp,
  children,
  size,
  onCardAction,
  values: valuesProp,
  isEditable,
  isResizable,
  i18n,
  tooltip,
  locale,
  timeRange,
  timeRangeOptions,
  availableActions,
  isLoading,
  ...others
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  // Set the locale
  dayjs.locale(locale);
  /** Searches for variables and updates the card if it is passed the cardVariables prop */
  const {
    title,
    content: { columns = [], showHeader, expandedRows, sort, thresholds, emptyMessage },
    values: data,
  } = handleCardVariables(titleProp, contentProp, valuesProp, others);

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  /** adds the id to the card action */
  const cachedOnCardAction = useCallback((...args) => onCardAction(id, ...args), [
    onCardAction,
    id,
  ]);

  const renderActionCell = (cellItem) => {
    const actionList = JSON.parse(cellItem.value);
    return actionList && actionList.length === 1 ? (
      React.createElement(
        typeof actionList[0].icon === 'string' ? icons[actionList[0].icon] : actionList.icon,
        {
          className: `${iotPrefix}--table-card--action-icon`,
          onClick: (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            onCardAction(id, 'TABLE_CARD_ROW_ACTION', {
              rowId: cellItem.rowId,
              actionId: actionList[0].id,
            });
          },
          'aria-label': actionList[0].label,
        }
      )
    ) : actionList && actionList.length > 1 ? (
      <OverflowMenu
        className={`${iotPrefix}--table-card--overflow-menu`}
        renderIcon={() => (
          <OverflowMenuVertical16
            fill="#5a6872"
            description={mergedI18n.overflowMenuIconDescription}
          />
        )}
      >
        {actionList.map((item) => {
          return (
            <OverflowMenuItem
              key={item.id}
              itemText={item.labelText}
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                onCardAction(id, 'TABLE_CARD_ROW_ACTION', {
                  rowId: cellItem.rowId,
                  actionId: item.id,
                });
              }}
            />
          );
        })}
      </OverflowMenu>
    ) : null;
  };

  const renderThresholdIcon = (cellItem) => {
    const matchingThresholdValue = findMatchingThresholds(
      thresholds,
      cellItem.row,
      cellItem.columnId
    )[0];

    return matchingThresholdValue ? (
      <ThresholdIcon
        title={`${matchingThresholdValue.dataSourceId}: ${matchingThresholdValue.currentValue} ${matchingThresholdValue.comparison} ${matchingThresholdValue.value}`}
        {...matchingThresholdValue}
        strings={mergedI18n}
        showSeverityLabel={matchingThresholdValue.showSeverityLabel}
        severityLabel={matchingThresholdValue.severityLabel}
        renderIconByName={others.renderIconByName}
      />
    ) : null;
  };

  // Should the table data be filtered to only match on threshold
  const uniqueThresholds = uniqBy(thresholds, 'dataSourceId');
  const onlyShowIfColumnHasData = uniqueThresholds.find((i) => i.showOnContent);
  const tableData = useMemo(
    () =>
      onlyShowIfColumnHasData
        ? data
            .map((i) => (i.values[onlyShowIfColumnHasData.dataSourceId] ? i : null))
            .filter((i) => i)
        : data,
    [onlyShowIfColumnHasData, data]
  );

  // always add the last action column has default
  const actionColumn = [
    {
      id: 'actionColumn',
      name: '',
      width: '60px',
      isSortable: false,
      renderDataFunction: renderActionCell,
      priority: 1,
    },
  ];

  const hasActionColumn = data.filter((i) => i.actions).length > 0;

  // If a column has a linkTemplate, format the column to render a link
  const columnsWithFormattedLinks = createColumnsWithFormattedLinks(columns, others.cardVariables);

  // filter to get the indexes for each one
  const columnsUpdated = cloneDeep(columnsWithFormattedLinks);

  /**
   * Generates a threshold column based off the uniqueThreshold's value
   * @param {string} columnId AKA dataSourceId
   * @returns {Object} new column with rendered threshold
   */
  const generateThresholdColumn = (columnId) => {
    // Need to find the index of the dataSource regardless of uniqueThresholds ordering
    // Find the matching column to get the correct label to put on the column
    const matchingColumn = columnsUpdated.find((column) => column.dataSourceId === columnId);
    const uniqueThresholdIndex = uniqueThresholds.findIndex(
      (threshold) => threshold.dataSourceId === columnId
    );
    return {
      id: `iconColumn-${columnId}`,
      label: uniqueThresholds[uniqueThresholdIndex].label
        ? uniqueThresholds[uniqueThresholdIndex].label
        : `${matchingColumn?.label || capitalize(columnId)} ${mergedI18n.severityLabel}`,
      width: uniqueThresholds[uniqueThresholdIndex].width,
      isSortable: true,
      renderDataFunction: renderThresholdIcon,
      priority: 1,
      filter: {
        isMultiselect: true,
        placeholderText: mergedI18n.selectSeverityPlaceholder,
        options: [
          {
            id: mergedI18n.criticalLabel,
            text: mergedI18n.criticalLabel,
          },
          {
            id: mergedI18n.moderateLabel,
            text: mergedI18n.moderateLabel,
          },
          {
            id: mergedI18n.lowLabel,
            text: mergedI18n.lowLabel,
          },
        ],
      },
    };
  };

  // Add the new threshold columns to the existing columns
  uniqueThresholds.forEach((threshold) => {
    const columnIndex = columnsUpdated.findIndex(
      (column) => column.dataSourceId === threshold.dataSourceId
    );
    // If columnIndex is not -1, there was a match so add the column. Otherwise, skip the column as it will be added
    // in the next call
    if (columnIndex !== -1) {
      columnsUpdated.splice(columnIndex, 0, generateThresholdColumn(threshold.dataSourceId));
    }
  });

  // Check for any threshold columns that weren't matched (if the column was hidden) and add to the end of the array
  const missingThresholdColumns = uniqueThresholds.filter((threshold) => {
    return !columnsUpdated.find((column) => threshold.dataSourceId === column.dataSourceId);
  });

  if (missingThresholdColumns.length > 0) {
    columnsUpdated.splice(
      columnsUpdated.length,
      0,
      ...missingThresholdColumns.map(({ dataSourceId }) => generateThresholdColumn(dataSourceId))
    );
  }

  const newColumns = thresholds ? columnsUpdated : columnsWithFormattedLinks;

  const filteredTimestampColumns = useMemo(
    () =>
      columns
        .map((column) => (column.type && column.type === 'TIMESTAMP' ? column.dataSourceId : null))
        .filter((i) => !isNil(i)),
    [columns]
  );
  const columnsToRender = useMemo(
    () =>
      newColumns
        .map((i) => ({
          ...i,
          id: i.dataSourceId ? i.dataSourceId : i.id,
          name: i.label ? i.label : i.dataSourceId || '', // don't force label to be required
          isSortable: true,
          width: i.width ? `${i.width}px` : newSize === CARD_SIZES.LARGETHIN ? '150px' : '', // force the text wrap
          filter: i.filter
            ? i.filter
            : { placeholderText: mergedI18n.defaultFilterStringPlaceholdText }, // if filter not send we send empty object
          renderDataFunction: i.renderDataFunction // use the default render function of the column
            ? i.renderDataFunction
            : (
                { value } // default render function is to handle timestamp
              ) =>
                // if it's a timestamp column type make sure to format it
                filteredTimestampColumns.includes(i.dataSourceId) && !isEditable
                  ? dayjs(value).format('L HH:mm')
                  : isNil(value)
                  ? ''
                  : value.toString(),
        }))
        .concat(hasActionColumn ? actionColumn : []),
    [
      actionColumn,
      filteredTimestampColumns,
      hasActionColumn,
      isEditable,
      mergedI18n.defaultFilterStringPlaceholdText,
      newColumns,
      newSize,
    ]
  );

  const ordering = useMemo(
    () =>
      columnsToRender.map(({ id: columnId, priority }) => {
        const prio = priority || 1; // default to 1 if not provided
        const isHidden =
          (newSize === CARD_SIZES.LARGETHIN && prio !== 1) ||
          (newSize === CARD_SIZES.LARGE && !(prio === 1 || prio === 2));

        return { columnId, isHidden };
      }),
    [columnsToRender, newSize]
  );

  const filteredPrecisionColumns = useMemo(
    () =>
      columns
        .map((column) =>
          column.precision
            ? { dataSourceId: column.dataSourceId, precision: column.precision }
            : null
        )
        .filter((i) => !isNil(i)),
    [columns]
  );

  // Map from threshold severity number to label
  const thresholdSeverityLabelsMap = {
    1: mergedI18n.criticalLabel,
    2: mergedI18n.moderateLabel,
    3: mergedI18n.lowLabel,
  };

  // if we're in editable mode, generate fake data
  const tableDataWithTimestamp = useMemo(
    () =>
      isEditable
        ? generateTableSampleValues(id, columns)
        : hasActionColumn || filteredPrecisionColumns.length || thresholds
        ? tableData.map((i) => {
            // if has custom action
            const action = hasActionColumn
              ? { actionColumn: JSON.stringify(i.actions || []) }
              : null;

            const matchingThresholds = thresholds
              ? findMatchingThresholds(thresholds, i.values)
              : null;

            // map each of the matching thresholds into a data object
            const iconColumns = matchingThresholds
              ? matchingThresholds.reduce((thresholdData, threshold) => {
                  thresholdData[`iconColumn-${threshold.dataSourceId}`] = // eslint-disable-line no-param-reassign
                    thresholdSeverityLabelsMap[threshold.severity];
                  return thresholdData;
                }, {})
              : null;

            // if column have custom precision value
            const precisionUpdated = filteredPrecisionColumns.length
              ? Object.keys(i.values).reduce((acc, value) => {
                  const precision = filteredPrecisionColumns.find(
                    (item) => item.dataSourceId === value
                  );

                  // If I find a precision column it should override the normal
                  if (precision) {
                    acc[value] = determinePrecisionAndValue(
                      precision.precision,
                      i.values[value],
                      locale
                    );
                  }

                  return acc;
                }, {})
              : null;

            return {
              id: i.id,
              values: {
                ...iconColumns,
                ...action,
                ...i.values,
                ...action,
                ...precisionUpdated,
              },
              isSelectable: false,
            };
          })
        : tableData,
    [
      isEditable,
      id,
      columns,
      hasActionColumn,
      filteredPrecisionColumns,
      thresholds,
      tableData,
      thresholdSeverityLabelsMap,
      locale,
    ]
  );

  // format expanded rows to send to Table component
  const expandedRowsFormatted = useMemo(
    () =>
      expandedRows && expandedRows.length
        ? tableData.map((dataItem) => {
            // filter the data keys and find the expandaded row exist for that key
            const expandedItem = Object.keys(dataItem.values)
              .map((value) => expandedRows.filter((item) => item.id === value)[0])
              .filter((i) => i);

            // add links and link variables to the expandedItem
            const formattedExpandedItems = handleExpandedItemLinks(
              dataItem.values,
              expandedItem,
              others.cardVariables
            );

            return {
              rowId: dataItem.id,
              content: (
                <div
                  key={`${dataItem.id}-expanded`}
                  className={`${iotPrefix}--table-card--expanded-row-content`}
                >
                  {formattedExpandedItems.length ? (
                    formattedExpandedItems.map((item, index) => (
                      <div
                        key={`${item.id}-expanded-${index}`}
                        className={`${iotPrefix}--table-card--expanded`}
                      >
                        {item.linkTemplate ? (
                          <>
                            <p key={`${item.id}-label`} style={{ marginRight: '5px' }}>
                              {item ? item.label : '--'}
                            </p>
                            <Link
                              key={`${item.id}-link`}
                              href={item.linkTemplate.href}
                              target={item.linkTemplate.target ? item.linkTemplate.target : null}
                            >
                              {dataItem.values[item.id]}
                            </Link>
                          </>
                        ) : (
                          <>
                            <p key={`${item.id}-label`} style={{ marginRight: '5px' }}>
                              {item ? item.label : '--'}
                            </p>
                            <span key={`${item.id}-value`}>
                              {item
                                ? item.type === 'TIMESTAMP'
                                  ? dayjs(dataItem.values[item.id]).format('L HH:mm')
                                  : dataItem.values[item.id]
                                : null}
                            </span>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      key={`${dataItem.id}-expanded`}
                      className={`${iotPrefix}--table-card--expanded`}
                    >
                      {' '}
                      <p key={`${dataItem.id}-label`}>--</p>
                    </div>
                  )}
                </div>
              ),
            };
          })
        : [],
    [expandedRows, others.cardVariables, tableData]
  );

  // is columns recieved is different from the columnsToRender show card expand
  const isExpandable = !!ordering.find((col) => col.isHidden);

  const hasFilter = newSize !== CARD_SIZES.LARGETHIN;

  const hasRowExpansion = !!(expandedRows && expandedRows.length);

  // Defined the first column to be sorted, if column has defined sort
  const columnStartSortDefined = columnsToRender.find((item) => item.sort);

  // if not sort by column provided, sort on the first priority 1 column
  const columnStartSort = !columnStartSortDefined
    ? columnsToRender.find((item) => item.priority === 1)
    : columnStartSortDefined;

  const mergedAvailableActions = {
    ...availableActions,
    expand: isExpandable,
    range: true,
  };

  const cardToolbar = (
    <CardToolbar
      availableActions={mergedAvailableActions}
      i18n={mergedI18n}
      isEditable={isEditable}
      isExpanded={isExpanded}
      onCardAction={cachedOnCardAction}
      width={newSize.width}
      timeRange={timeRange}
      timeRangeOptions={timeRangeOptions}
    />
  );

  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  return (
    <Card
      id={id}
      size={newSize}
      onCardAction={onCardAction}
      availableActions={{ expand: isExpandable, range: true }}
      isEditable={isEditable}
      isResizable={isResizable}
      isExpanded={isExpanded}
      i18n={mergedI18n}
      resizeHandles={resizeHandles}
      hideHeader
      // Use the Table's loading state rather than Card's
      isLoading={false}
      {...others}
    >
      {({ height }) => {
        const numberOfRowsPerPage = Math.max(
          !isNil(height) && height !== 0 ? Math.floor((height - 48) / 48) : 10,
          1 // at least pass 1 row per page
        );
        return (
          <StyledStatefulTable
            columns={columnsToRender}
            data={tableDataWithTimestamp}
            id={`table-for-card-${id}`}
            key={`table-for-card-${numberOfRowsPerPage}-${columnsToRender?.length}`}
            isExpanded={isExpanded}
            secondaryTitle={title}
            tooltip={tooltip}
            options={{
              hasPagination: true,
              hasSearch: !isEditable, // Remove search bar on preview mode. https://github.ibm.com/wiotp/monitoring-dashboard/issues/1749
              hasFilter,
              hasRowExpansion,
            }}
            locale={locale}
            expandedData={expandedRowsFormatted}
            actions={{
              table: {
                onRowClicked: () => {},
                onRowExpanded: () => {},
                onChangeSort: () => {},
              },
              pagination: { onChangePage: () => {} },
              toolbar: {
                onClearAllFilters: () => {},
                onToggleFilter: () => {},
                onDownloadCSV: (filteredData) => csvDownloadHandler(filteredData, title),
              },
            }}
            view={{
              pagination: {
                pageSize: numberOfRowsPerPage,
                pageSizes: [numberOfRowsPerPage, 25, 100],
                isItemPerPageHidden: !isExpanded,
              },
              toolbar: {
                activeBar: null,
                isDisabled: isEditable,
                customToolbarContent: cardToolbar,
              },
              filters: [],
              table: {
                ...(columnStartSort
                  ? {
                      sort: {
                        columnId: columnStartSort.id,
                        direction: !columnStartSortDefined ? sort : columnStartSortDefined.sort,
                      },
                    }
                  : {}),
                emptyState: {
                  message: emptyMessage || mergedI18n.emptyMessage,
                },
                loadingState: {
                  isLoading,
                  rowCount: 7,
                },
                ordering,
              },
            }}
            showHeader={showHeader !== undefined ? showHeader : true}
            i18n={mergedI18n} // TODO: add Card defaultprops ?
          />
        );
      }}
    </Card>
  );
};

TableCard.propTypes = { ...CardPropTypes, ...TableCardPropTypes };
TableCard.displayName = 'TableCard';
TableCard.defaultProps = defaultProps;
TableCard.defaultProps.i18n = {
  ...defaultProps.i18n,
  ...CardDefaultProps.i18n,
};
export default TableCard;
