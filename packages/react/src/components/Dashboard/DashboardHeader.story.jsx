import React from 'react';
import { text } from '@storybook/addon-knobs';
import Pin from '@carbon/icons-react/lib/pin/20';
import Edit from '@carbon/icons-react/lib/edit/20';
import { TrashCan20 } from '@carbon/icons-react';
import { action } from '@storybook/addon-actions';
import { DatePicker, DatePickerInput } from 'carbon-components-react';

import StoryNotice, { deprecatedStoryTitle } from '../../internal/StoryNotice';

import DashboardHeader from './DashboardHeader';

export default {
  title: 'Watson IoT/🚫 Dashboard Header',
};

export const Deprecated = () => <StoryNotice componentName="DashboardHeader" />;
Deprecated.story = {
  name: deprecatedStoryTitle,
};

export const Basic = () => {
  return (
    <div style={{ minWidth: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of monthly data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
      />
    </div>
  );
};

Basic.story = {
  name: 'basic',
};

export const WithFilter = () => {
  return (
    <div style={{ width: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of daily data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
        filter={
          <DatePicker id="date-picker" onChange={action('onChangeDate')} datePickerType="single">
            <DatePickerInput
              id="date-picker-input-id"
              className="some-class"
              labelText="Select day"
              pattern="d{1,2}/d{4}"
              placeholder="mm/dd/yyyy"
              invalidText="A valid value is required"
              iconDescription="Icon description"
              onClick={action('onClickDate')}
              onChange={action('onTextChange')}
            />
          </DatePicker>
        }
      />
    </div>
  );
};

WithFilter.story = {
  name: 'with filter',
};

export const WithCustomActions = () => {
  return (
    <div style={{ width: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of daily data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
        actions={[
          { id: 'edit', labelText: 'Edit', icon: <Edit /> },
          { id: 'delete', labelText: 'Delete', icon: TrashCan20 },
        ]}
        onDashboardAction={action('onDashboardAction')}
      />
    </div>
  );
};

WithCustomActions.story = {
  name: 'with custom actions',
};

export const WithFilterAndCustomActions = () => {
  return (
    <div style={{ width: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of daily data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
        filter={
          <DatePicker id="date-picker" onChange={action('onChangeDate')} datePickerType="single">
            <DatePickerInput
              id="date-picker-input-id"
              className="some-class"
              hideLabel
              labelText="Select day"
              pattern="d{1,2}/d{4}"
              placeholder="mm/dd/yyyy"
              invalidText="A valid value is required"
              iconDescription="Icon description"
              onClick={action('onClickDate')}
              onChange={action('onTextChange')}
            />
          </DatePicker>
        }
        actions={[
          { id: 'edit', labelText: 'Edit', icon: <Edit /> },
          { id: 'delete', labelText: 'Delete', icon: <TrashCan20 /> },
          { id: 'pin', labelText: 'Pin', icon: <Pin /> },
        ]}
        onDashboardAction={action('onDashboardAction')}
      />
    </div>
  );
};

WithFilterAndCustomActions.story = {
  name: 'with filter and custom actions',
};

export const WithCustomActionsComponent = () => {
  return (
    <DashboardHeader
      title={text('title', 'Monthly Building: Munich')}
      description={text('description', 'Shows an overview of daily data for a building')}
      lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
      actions={[
        {
          id: 'edit',
          customActionComponent: (
            <div key="my custom component">we can now send custom components</div>
          ),
        },
      ]}
    />
  );
};

WithCustomActionsComponent.story = {
  name: 'with custom actions component',
};
