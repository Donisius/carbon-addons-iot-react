import React, { useState, createElement } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';

import TableViewDropdown from './TableViewDropdown';

export default {
  title: __DEV__ ? 'Watson IoT/⚠️ Table/TableViewDropdown' : 'Watson IoT/Table/TableViewDropdown',

  parameters: {
    component: TableViewDropdown,
  },
};

export const _TableViewDropdown = () => {
  const myViews = [
    {
      id: 'view-1',
      text: 'My saved 1',
    },
    {
      id: 'view-2',
      text: 'My saved 2',
    },
    {
      id: 'view-3',
      text: 'My saved 3 with a very long name that will get truncated',
    },
  ];

  // This is a simple example state that should be replaced by the
  // consuming Application's data store
  const [selectedViewId, setSelectedViewId] = useState(undefined);

  return (
    <div
      style={{
        width: select('wrapper width', ['300px', '100px'], '300px'),
      }}
    >
      <TableViewDropdown
        selectedViewId={selectedViewId}
        activeViewEdited={boolean('activeViewEdited', true)}
        views={myViews}
        actions={{
          onSaveAsNewView: action('onSaveAsNewView'),
          onSaveChanges: action('onSaveChanges'),
          onManageViews: action('onManageViews'),
          onChangeView: (viewItem) => {
            setSelectedViewId(viewItem.id);
            action('onChangeView')(viewItem);
          },
        }}
      />
    </div>
  );
};

_TableViewDropdown.story = {
  name: 'TableViewDropdown',
  decorators: [createElement],
  parameters: {
    info: {
      propTables: [TableViewDropdown],
      text: `This is an example of the <TableViewDropdown> table sub component. The state needs to be managed by the
     consuming application.

     ~~~js
    const myViews = [
      {
        id: 'view-1',
        text: 'My saved 1',
      },
      {
        id: 'view-2',
        text: 'My saved 2',
      },
      {
        id: 'view-3',
        text: 'My saved 3 with a very long name that will get truncated',
      },
    ];

    return React.createElement(() => {
      // This is a simple example state that should be replaced by the
      // consuming Application's data store
      const [selectedViewId, setSelectedViewId] = useState(undefined);

      return (
        <div style={{ width: select('wrapper width', ['300px', '100px'], '300px') }}>
          <TableViewDropdown
            selectedViewId={selectedViewId}
            activeViewEdited={boolean('activeViewEdited', true)}
            views={myViews}
            actions={{
              onSaveAsNewView: action('onSaveAsNewView'),
              onManageViews: action('onManageViews'),
              onChangeView: viewItem => {
                setSelectedViewId(viewItem.id);
                action('onChangeView')();
              },
            }}
          />
        </div>
      );
    });
     ~~~
     `,
    },
  },
};
