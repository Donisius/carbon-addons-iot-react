import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, number, select, boolean } from '@storybook/addon-knobs';
import { layout05 } from '@carbon/layout';
import { gray20, yellow } from '@carbon/colors';

import { CARD_SIZES, CARD_DATA_STATE } from '../../constants/LayoutConstants';
import { getDataStateProp } from '../Card/Card.story';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import GaugeCard from './GaugeCard';

const content = {
  gauges: [
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      maximumValue: 100,
      color: 'orange',
      backgroundColor: gray20,
      shape: 'circle',
      trend: {
        /** the key to load the trend value from the values object. */
        dataSourceId: 'usageTrend',
        color: text('Trend color', ''),
        trend: select('Trend', ['up', 'down'], 'up'),
      },
      thresholds: [
        {
          comparison: '>',
          value: 0,
          color: 'red', // red
          label: 'Poor',
        },
        {
          comparison: '>',
          value: 60,
          color: yellow, // yellow
          label: 'Fair',
        },
        {
          comparison: '>',
          value: 80,
          color: 'green', // green
          label: select('Threshold label (> 80%)', ['Good', null], 'Good'),
        },
      ],
    },
  ],
};

export default {
  title: 'Watson IoT/GaugeCard',

  parameters: {
    component: GaugeCard,
  },
};

export const Basic = () => {
  return (
    <div
      style={{
        width: `${getCardMinSize('sm', CARD_SIZES.SMALL).x}px`,
        margin: layout05,
      }}
    >
      <GaugeCard
        isLoading={boolean('Is loading', false)}
        tooltip={<p>Health - of floor 8</p>}
        id="GaugeCard"
        title={text('Text', 'Health')}
        size={CARD_SIZES.SMALL}
        values={{
          usage: number('Gauge value', 81),
          usageTrend: '12%',
        }}
        content={content}
      />
    </div>
  );
};

Basic.story = {
  name: 'basic',
};

export const BasicWithExpand = () => {
  return (
    <div
      style={{
        width: `${getCardMinSize('sm', CARD_SIZES.SMALL).x}px`,
        margin: layout05,
      }}
    >
      <GaugeCard
        isLoading={boolean('Is loading', false)}
        tooltip={<p>Health - of floor 8</p>}
        id="GaugeCard"
        title={text('Text', 'Health')}
        size={CARD_SIZES.SMALL}
        values={{
          usage: number('Gauge value', 81),
          usageTrend: '12%',
        }}
        isExpanded={false}
        availableActions={{
          expand: true,
        }}
        content={content}
        onCardAction={action('Expand button clicked')}
      />
    </div>
  );
};

BasicWithExpand.story = {
  name: 'basic with expand',
};

export const WithDataStateNoData = () => {
  const myDataState = {
    type: select('dataState : Type', Object.keys(CARD_DATA_STATE), CARD_DATA_STATE.NO_DATA),
    ...getDataStateProp(),
  };
  const content = {
    gauges: [],
  };

  return (
    <div style={{ width: '252px', margin: layout05 }}>
      <GaugeCard
        isLoading={boolean('Is loading', false)}
        tooltip={<p>Health - of floor 8</p>}
        id="GaugeCard"
        title={text('Text', 'Health')}
        size={select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL)}
        values={{
          usage: number('Gauge value', 81),
          usageTrend: '12%',
        }}
        content={content}
        dataState={myDataState}
      />
      <div style={{ height: '150vh' }} />
    </div>
  );
};

WithDataStateNoData.story = {
  name: 'with data state no-data',
};
