import React from 'react';
import PropTypes from 'prop-types';
import {
  Column20,
  Filter20,
  Download20,
  Edit20,
  OverflowMenuVertical20,
} from '@carbon/icons-react';
import {
  DataTable,
  Button,
  Tooltip,
  OverflowMenu,
  OverflowMenuItem,
} from 'carbon-components-react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';

import deprecate from '../../../internal/deprecate';
import {
  TableSearchPropTypes,
  defaultI18NPropTypes,
  ActiveTableToolbarPropType,
  TableRowPropTypes,
} from '../TablePropTypes';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';
import { settings } from '../../../constants/Settings';
import { RuleGroupPropType } from '../../RuleBuilder/RuleBuilderPropTypes';

import TableToolbarAdvancedFilterFlyout from './TableToolbarAdvancedFilterFlyout';
import TableToolbarSVGButton from './TableToolbarSVGButton';

const { iotPrefix } = settings;

const {
  TableToolbar: CarbonTableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableBatchActions,
  TableBatchAction,
} = DataTable;

const propTypes = {
  /** id of table */
  tableId: PropTypes.string.isRequired,
  secondaryTitle: PropTypes.string,
  tooltip: PropTypes.node,
  /** global table options */
  options: PropTypes.shape({
    hasAdvancedFilter: PropTypes.bool,
    hasAggregations: PropTypes.bool,
    hasFilter: PropTypes.bool,
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    hasRowEdit: PropTypes.bool,
    /** Optional boolean to render rowCount in header
     *  NOTE: Deprecated in favor of secondaryTitle for custom use
     */
    hasRowCountInHeader: deprecate(
      PropTypes.bool,
      '\n The prop `hasRowCountInHeader` has been deprecated in favor `secondaryTitle`'
    ),
    // True if use can save/load views
    hasUserViewManagement: PropTypes.bool,
  }).isRequired,
  /** internationalized labels */
  i18n: PropTypes.shape({
    clearAllFilters: PropTypes.string,
    columnSelectionButtonAria: PropTypes.string,
    filterButtonAria: PropTypes.string,
    editButtonAria: PropTypes.string,
    searchLabel: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    batchCancel: PropTypes.string,
    itemsSelected: PropTypes.string,
    itemSelected: PropTypes.string,
    filterNone: PropTypes.string,
    filterAscending: PropTypes.string,
    filterDescending: PropTypes.string,
    toggleAggregations: PropTypes.string,
  }),
  /**
   * Action callbacks to update tableState
   */
  actions: PropTypes.shape({
    onCancelBatchAction: PropTypes.func,
    onApplyBatchAction: PropTypes.func,
    onClearAllFilters: PropTypes.func,
    onToggleAggregations: PropTypes.func,
    onToggleColumnSelection: PropTypes.func,
    onToggleFilter: PropTypes.func,
    onToggleAdvancedFilter: PropTypes.func,
    onCreateAdvancedFilter: PropTypes.func,
    onChangeAdvancedFilter: PropTypes.func,
    onCancelAdvancedFilter: PropTypes.func,
    onShowRowEdit: PropTypes.func,
  }).isRequired,
  /**
   * Inbound tableState
   */
  tableState: PropTypes.shape({
    /** is the toolbar currently disabled */
    isDisabled: PropTypes.bool,
    /** Which toolbar is currently active */
    activeBar: ActiveTableToolbarPropType,
    /** total number of selected rows */
    totalSelected: PropTypes.number,
    totalItemsCount: PropTypes.number,
    /** row selection option */
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    /** optional content to render inside the toolbar  */
    customToolbarContent: PropTypes.node,
    /** available batch actions */
    batchActions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        labelText: PropTypes.string.isRequired,
        icon: PropTypes.node,
        iconDescription: PropTypes.string,
      })
    ),
    search: TableSearchPropTypes,
    /** buttons to be shown with when activeBar is 'rowEdit' */
    rowEditBarButtons: PropTypes.node,

    /** a stripped down version of the RuleBuilderFilterPropType */
    advancedFilters: PropTypes.arrayOf(
      PropTypes.shape({
        /** Unique id for particular filter */
        filterId: PropTypes.string.isRequired,
        /** Text for main tilte of page */
        filterTitleText: PropTypes.string.isRequired,
        filterRules: RuleGroupPropType.isRequired,
      })
    ),
    /** currently selected advanced filters */
    selectedAdvancedFilterIds: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  /** Row value data for the body of the table */
  data: TableRowPropTypes.isRequired,

  testID: PropTypes.string,
};

const defaultProps = {
  i18n: {
    ...defaultI18NPropTypes,
  },
  secondaryTitle: null,
  tooltip: null,
  testID: '',
};

const TableToolbar = ({
  tableId,
  className,
  i18n,
  secondaryTitle,
  tooltip,
  options: {
    hasAdvancedFilter,
    hasAggregations,
    hasColumnSelection,
    hasFilter,
    hasSearch,
    hasRowSelection,
    hasRowCountInHeader,
    hasRowEdit,
    hasUserViewManagement,
  },
  actions: {
    onCancelBatchAction,
    onApplyBatchAction,
    onClearAllFilters,
    onToggleAggregations,
    onToggleColumnSelection,
    onToggleFilter,
    onShowRowEdit,
    onApplySearch,
    onDownloadCSV,
    onApplyAdvancedFilter,
    onCancelAdvancedFilter,
    onCreateAdvancedFilter,
    onChangeAdvancedFilter,
    onToggleAdvancedFilter,
  },
  tableState: {
    advancedFilterFlyoutOpen,
    advancedFilters,
    totalSelected,
    totalFilters,
    batchActions,
    search,
    activeBar,
    customToolbarContent,
    isDisabled,
    totalItemsCount,
    rowEditBarButtons,
    filters,
    selectedAdvancedFilterIds,
    columns,
    ordering,
  },
  data,
  testID,
}) => (
  <CarbonTableToolbar
    data-testid={testID}
    className={classnames(`${iotPrefix}--table-toolbar`, className)}
  >
    <TableBatchActions
      data-testID={`${testID}-batch-actions`}
      className={`${iotPrefix}--table-batch-actions`}
      onCancel={onCancelBatchAction}
      shouldShowBatchActions={hasRowSelection === 'multi' && totalSelected > 0}
      totalSelected={totalSelected}
      translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
    >
      {batchActions.map(({ id, labelText, ...others }) => (
        <TableBatchAction key={id} onClick={() => onApplyBatchAction(id)} {...others}>
          {labelText}
        </TableBatchAction>
      ))}
    </TableBatchActions>
    {secondaryTitle ? (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
      <label className={`${iotPrefix}--table-toolbar-secondary-title`}>{secondaryTitle}</label>
    ) : null}
    {
      // Deprecated in favor of secondaryTitle for a more general use-case
      hasRowCountInHeader ? (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
        <label className={`${iotPrefix}--table-toolbar-secondary-title`}>
          {i18n.rowCountInHeader(totalItemsCount)}
        </label>
      ) : null
    }
    {tooltip && (
      <div className={`${iotPrefix}--table-tooltip-container`}>
        <Tooltip
          triggerId={`card-tooltip-trigger-${tableId}`}
          tooltipId={`card-tooltip-${tableId}`}
          triggerText=""
        >
          {tooltip}
        </Tooltip>
      </div>
    )}
    {activeBar === 'rowEdit' ? (
      <div className={`${iotPrefix}--table-row-edit-actions`}>{rowEditBarButtons}</div>
    ) : (
      <TableToolbarContent
        data-testid={`${testID}-content`}
        className={`${iotPrefix}--table-toolbar-content`}
      >
        {hasSearch ? (
          <TableToolbarSearch
            {...search}
            key={
              // If hasUserViewManagement is active the whole table is regenerated when a new
              // view is loaded so we probably don't need this key-gen fix to preset a search text.
              // The userViewManagement also needs to be able to set the search.defaultValue
              // while typing without loosing input focus.
              hasUserViewManagement
                ? 'table-toolbar-search'
                : `table-toolbar-search${search.defaultValue}${search.value}`
            }
            defaultValue={search.defaultValue || search.value}
            className="table-toolbar-search"
            translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
            id={`${tableId}-toolbar-search`}
            onChange={(event, defaultValue) => {
              // https://github.com/carbon-design-system/carbon/issues/6157
              onApplySearch(event?.target?.value || defaultValue);
            }}
            disabled={isDisabled}
            data-testid={`${testID}-search`}
          />
        ) : null}
        {totalFilters > 0 ? (
          <Button kind="secondary" onClick={onClearAllFilters} disabled={isDisabled}>
            {i18n.clearAllFilters}
          </Button>
        ) : null}
        {onDownloadCSV ? (
          <TableToolbarSVGButton
            onClick={() => {
              // hand back the filtered data
              onDownloadCSV(data);
            }}
            description={i18n.downloadIconDescription}
            testId="download-button"
            renderIcon={Download20}
            disabled={isDisabled}
          />
        ) : null}
        {hasColumnSelection ? (
          <TableToolbarSVGButton
            isActive={activeBar === 'column'}
            onClick={onToggleColumnSelection}
            description={i18n.columnSelectionButtonAria}
            testId="column-selection-button"
            renderIcon={Column20}
            disabled={isDisabled}
          />
        ) : null}
        {hasFilter ? (
          <TableToolbarSVGButton
            isActive={activeBar === 'filter'}
            onClick={onToggleFilter}
            description={i18n.filterButtonAria}
            testId="filter-button"
            renderIcon={Filter20}
            disabled={isDisabled}
          />
        ) : null}
        {hasAdvancedFilter ? (
          <TableToolbarAdvancedFilterFlyout
            actions={{
              onApplyAdvancedFilter,
              onCancelAdvancedFilter,
              onCreateAdvancedFilter,
              onChangeAdvancedFilter,
              onToggleAdvancedFilter,
            }}
            columns={columns.map((column) => ({
              ...column.filter,
              id: column.id,
              name: column.name,
              isFilterable: !isNil(column.filter),
              isMultiselect: column.filter?.isMultiselect,
            }))}
            tableState={{
              filters,
              advancedFilters,
              selectedAdvancedFilterIds,
              advancedFilterFlyoutOpen,
              ordering,
              hasFastFilter: hasAdvancedFilter === 'onKeyPress',
            }}
            i18n={{
              ...pick(
                i18n,
                'filterText',
                'clearFilterText',
                'clearSelectionText',
                'openMenuText',
                'closeMenuText',
                'applyButtonText',
                'cancelButtonText',
                'advancedFilterLabelText',
                'createNewAdvancedFilterText',
                'advancedFilterPlaceholderText',
                'simpleFiltersTabLabel',
                'advancedFiltersTabLabel'
              ),
            }}
          />
        ) : null}
        {hasRowEdit ? (
          <TableToolbarSVGButton
            isActive={activeBar === 'rowEdit'}
            description={i18n.editButtonAria}
            onClick={onShowRowEdit}
            testId="row-edit-button"
            renderIcon={Edit20}
            disabled={isDisabled}
          />
        ) : null}
        {hasAggregations ? (
          <OverflowMenu
            className={`${iotPrefix}--table-toolbar-aggregations__overflow-menu`}
            direction="bottom"
            flipped
            data-testid="table-head--overflow"
            onClick={(e) => e.stopPropagation()}
            renderIcon={OverflowMenuVertical20}
            iconClass={`${iotPrefix}--table-toolbar-aggregations__overflow-icon`}
          >
            <OverflowMenuItem
              itemText={i18n.toggleAggregations}
              key="table-aggregations-overflow-item"
              onClick={onToggleAggregations}
            />
          </OverflowMenu>
        ) : null}
        {
          // Default card header actions should be to the right of the table-specific actions
          customToolbarContent || null
        }
      </TableToolbarContent>
    )}
  </CarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
