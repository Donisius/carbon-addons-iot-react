import React, { useState, createElement } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';
import { Button } from 'carbon-components-react';
import { TrashCan16, Edit16, Copy16 } from '@carbon/icons-react';

import { Tag } from '../../Tag';

import TableManageViewsModal from './TableManageViewsModal';

const demoViews = Array(100)
  .fill({
    isDeleteable: true,
    isEditable: true,
    description: 'Entities: 2 filters, Alerts: 3 filters',
  })
  .map((view, index) => ({
    ...view,
    id: `id${index}`,
    title: `myView${index}`,
    isPublic: !!(index % 2),
  }));

export default {
  title: __DEV__
    ? 'Watson IoT/⚠️ Table/TableManageViewsModal'
    : 'Watson IoT/Table/TableManageViewsModal',

  parameters: {
    component: TableManageViewsModal,
  },
};

export const WithCallbacksImplemented = () => {
  const rowPerPage = 10;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({
    searchTerm: '',
    showPublic: true,
  });
  const [isOpen, setIsOpen] = useState(true);
  const [filteredViews, setFilteredViews] = useState(demoViews);
  const [viewsToShow, setViewsToShow] = useState(demoViews.slice(0, rowPerPage));

  const showPage = (pageNumber, views) => {
    const rowUpperLimit = pageNumber * rowPerPage;
    const currentItemsOnPage = views.slice(rowUpperLimit - rowPerPage, rowUpperLimit);
    setCurrentPageNumber(pageNumber);
    setViewsToShow(currentItemsOnPage);
  };

  const applyFiltering = ({ searchTerm, showPublic }) => {
    const views = demoViews
      .filter(
        (view) =>
          searchTerm === '' || view.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1
      )
      .filter((view) => (showPublic ? view : !view.isPublic));

    setFilteredViews(views);
    showPage(1, views);
  };

  const onDelete = (viewId) => {
    const deleteIndex = demoViews.findIndex((view) => view.id === viewId);
    demoViews.splice(deleteIndex, 1);
    setFilteredViews(demoViews);
    showPage(1, demoViews);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onEdit = (viewId) => {
    /* eslint-disable-next-line no-alert */
    alert(
      `EDIT ${viewId} \nThis action should close this modal and open TableSaveViewModal with the data of this view prefilled.`
    );
  };

  const onPage = (pageNumber) => showPage(pageNumber, filteredViews);

  const onSearchChange = (val) => {
    const searchTerm = val === undefined ? '' : val;
    const newFilters = { ...currentFilters, searchTerm };
    setCurrentFilters(newFilters);
    applyFiltering(newFilters);
  };

  const onDisplayPublicChange = (showPublic) => {
    const newFilters = { ...currentFilters, showPublic };
    setCurrentFilters(newFilters);
    applyFiltering(newFilters);
  };

  const pagination = {
    page: currentPageNumber,
    onPage,
    maxPage: Math.ceil(filteredViews.length / rowPerPage),
    pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
  };

  return (
    <TableManageViewsModal
      actions={{
        onDisplayPublicChange,
        onSearchChange,
        onEdit,
        onDelete,
        onClearError: action('onClearError'),
        onClose,
      }}
      defaultViewId="id1"
      error={select('error', [undefined, 'My error msg'], undefined)}
      isLoading={boolean('isLoading', false)}
      open={isOpen}
      views={viewsToShow}
      pagination={pagination}
    />
  );
};

WithCallbacksImplemented.story = {
  name: 'With callbacks implemented',
  decorators: [createElement],
  parameters: {
    info: {
      text: `
        This TableManageViewsModal story demonstrates a fully implemented example with data
        and actions working properly in the default configuration. The avaiability of
        'Delete' and 'Edit' actions are determined by the respective views data properties.

        ~~~js
        return React.createElement(() => {
          const rowPerPage = 10;
          const [currentPageNumber, setCurrentPageNumber] = useState(1);
          const [currentFilters, setCurrentFilters] = useState({ searchTerm: '', showPublic: true });
          const [isOpen, setIsOpen] = useState(true);
          const [filteredViews, setFilteredViews] = useState(demoViews);
          const [viewsToShow, setViewsToShow] = useState(demoViews.slice(0, rowPerPage));

          const showPage = (pageNumber, views) => {
            const rowUpperLimit = pageNumber * rowPerPage;
            const currentItemsOnPage = views.slice(rowUpperLimit - rowPerPage, rowUpperLimit);
            setCurrentPageNumber(pageNumber);
            setViewsToShow(currentItemsOnPage);
          };

          const applyFiltering = ({ searchTerm, showPublic }) => {
            const views = demoViews
              .filter(
                view =>
                  searchTerm === '' ||
                  view.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1
              )
              .filter(view => (showPublic ? view : !view.isPublic));

            setFilteredViews(views);
            showPage(1, views);
          };

          const onDelete = viewId => {
            const deleteIndex = demoViews.findIndex(view => view.id === viewId);
            demoViews.splice(deleteIndex, 1);
            setFilteredViews(demoViews);
            showPage(1, demoViews);
          };

          const onClose = () => {
            setIsOpen(false);
          };

          const onEdit = viewId => {
            /* eslint-disable-next-line no-alert */
            alert(
              'This action should close this modal and open TableSaveViewModal with the data of this view prefilled.'
            );
          };

          const onPage = pageNumber => showPage(pageNumber, filteredViews);

          const onSearchChange = val => {
            const searchTerm = val === undefined ? '' : val;
            const newFilters = { ...currentFilters, searchTerm };
            setCurrentFilters(newFilters);
            applyFiltering(newFilters);
          };

          const onDisplayPublicChange = showPublic => {
            const newFilters = { ...currentFilters, showPublic };
            setCurrentFilters(newFilters);
            applyFiltering(newFilters);
          };

          const pagination = {
            page: currentPageNumber,
            onPage,
            maxPage: Math.ceil(filteredViews.length / rowPerPage),
            pageOfPagesText: pageNumber => 'Page ' + pageNumber,
          };

          return (
            <TableManageViewsModal
              actions={{
                onDisplayPublicChange,
                onSearchChange,
                onEdit,
                onDelete,
                onClearError: action('onClearError'),
                onClose,
              }}
              defaultViewId="id1"
              error={select('error', [undefined, 'My error msg'], undefined)}
              isLoading={boolean('isLoading', false)}
              open={isOpen}
              views={viewsToShow}
              pagination={pagination}
            />
          );
        });
        ~~~
        `,
      propTables: [TableManageViewsModal],
    },
  },
};

export const WithCustomRowActionsCustomRenderingAndNoPagination = () => {
  const defaultViewId = 'id1';
  const myViews = demoViews.map((view) => ({ ...view, isClonable: true }));
  const renderButton = (id, onClick, icon, key, iconText) => (
    <Button
      key={key}
      data-testid={key}
      hasIconOnly
      iconDescription={iconText}
      kind="ghost"
      onClick={() => onClick(id)}
      renderIcon={icon}
      size="small"
      tooltipAlignment="center"
      tooltipPosition="left"
    />
  );

  const getCustomRowActions = ({ id, isEditable, isDeleteable, isClonable }) => {
    const rowActions = [];
    if (isEditable) {
      rowActions.push(renderButton(id, action('onEdit'), Edit16, 'editItemKey', 'Edit'));
    }
    if (isDeleteable) {
      rowActions.push(renderButton(id, action('onDelete'), TrashCan16, 'deleteKey', 'Delete'));
    }
    if (isClonable) {
      rowActions.push(renderButton(id, action('onClone'), Copy16, 'copyKey', 'Copy'));
    }
    return rowActions;
  };

  const getCustomRowTitle = ({ title }) => title;

  const getCustomRowDescription = ({ description }) => `PREFIXED - ${description}`;

  const getRowTags = ({ id, isPublic }, { i18n: { defaultLabelText } }) => {
    const tags =
      id === defaultViewId
        ? [
            <Tag type="blue" key="defaultTag">
              {defaultLabelText}
            </Tag>,
          ]
        : [];
    tags.push(
      isPublic ? (
        <Tag type="red" key="publicTag">
          public
        </Tag>
      ) : (
        <Tag type="green" key="privateTag">
          private
        </Tag>
      )
    );
    return tags;
  };

  return (
    <TableManageViewsModal
      actions={{
        onDisplayPublicChange: action('onDisplayPublicChange'),
        onSearchChange: action('onSearchChange'),
        onClearError: action('onClearError'),
        onClose: action('onClose'),
      }}
      error={select('error', [undefined, 'My error msg'], undefined)}
      isLoading={boolean('isLoading', false)}
      open={boolean('open', true)}
      views={myViews}
      overrides={{
        tableManageViewsList: {
          props: {
            rowActionsRenderer: getCustomRowActions,
            rowDescriptionInterpolation: getCustomRowDescription,
            rowTagsRenderer: getRowTags,
            rowTitleInterpolation: getCustomRowTitle,
            overrides: {
              list: {
                props: {
                  isLargeRow: false,
                },
              },
            },
          },
        },
      }}
    />
  );
};

WithCustomRowActionsCustomRenderingAndNoPagination.story = {
  name: 'with custom row actions, custom rendering and no Pagination',

  parameters: {
    info: {
      text: `
      This TableManageViewsModal story demonstrates how the component and subcomponents can
      be customized using the 'overrides pattern'. Here we override the rendering props
      for the internal TableManageViewsList to get different row actions and modify the row
      rendering in general. We also override the internal component List to make the rows small.`,
    },
  },
};
