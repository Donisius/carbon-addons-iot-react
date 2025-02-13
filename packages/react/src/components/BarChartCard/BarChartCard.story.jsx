import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { barChartData } from '../../utils/barChartDataSample';

import BarChartCard from './BarChartCard';

const COLORS = ['blue', 'red', 'green', 'yellow'];

const acceptableSizes = Object.keys(CARD_SIZES).filter(
  (size) => size.includes('MEDIUM') || size.includes('LARGE')
);

export default {
  title: __DEV__ ? 'Watson IoT/⚠️ BarChartCard' : 'Watson IoT/BarChartCard',
  parameters: {
    component: BarChartCard,
  },
};

export const SimpleBarVertical = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles by city')}
        id="simple-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          xLabel: 'Cities',
          yLabel: 'Particles',
          series: [
            {
              dataSourceId: 'particles',
              color: COLORS,
            },
          ],
          categoryDataSourceId: 'city',
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          unit: 'P',
          type: 'SIMPLE',
        })}
        values={barChartData.quarters.filter((q) => q.quarter === '2020-Q1')}
        size={size}
        availableActions={{ expand: true }}
      />
    </div>
  );
};

SimpleBarVertical.story = {
  name: 'Simple bar - Vertical',
};

export const SimpleBarHorizontal = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles by city')}
        id="simple-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          xLabel: 'Cities',
          yLabel: 'Particles',
          series: [
            {
              dataSourceId: 'particles',
              color: {
                Amsterdam: 'yellow',
                'New York': 'yellow',
                Bangkok: 'red',
                'San Francisco': 'pink',
              },
            },
          ],
          categoryDataSourceId: 'city',
          layout: BAR_CHART_LAYOUTS.HORIZONTAL,
          type: 'SIMPLE',
        })}
        values={barChartData.quarters.filter((a) => a.quarter === '2020-Q1')}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true }}
      />
    </div>
  );
};

SimpleBarHorizontal.story = {
  name: 'Simple bar - Horizontal',
};

export const SimpleBarTimeSeriesCustomDomainRange = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles over 4 days')}
        id="simple-time-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          xLabel: 'Date',
          yLabel: 'Particles',
          series: [
            {
              dataSourceId: 'particles',
              // colors: COLORS,
              label: 'Particles really long label to check trunc',
            },
          ],
          timeDataSourceId: 'timestamp',
          type: 'SIMPLE',
        })}
        domainRange={[1581251825000, 1581524625000]}
        values={barChartData.timestamps.filter((t) => t.city === 'Amsterdam')}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

SimpleBarTimeSeriesCustomDomainRange.story = {
  name: 'Simple bar - Time series - custom domainRange',
};

export const GroupedBarVertical = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="grouped-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.GROUPED,
          xLabel: 'Cities',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
              color: 'blue',
            },
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
            },
          ],
          categoryDataSourceId: 'city',
        })}
        values={barChartData.quarters.filter((a) => a.quarter === '2020-Q1')}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true }}
      />
    </div>
  );
};

GroupedBarVertical.story = {
  name: 'Grouped bar - Vertical',
};

export const GroupedBarHorizontal = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="grouped-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.GROUPED,
          layout: BAR_CHART_LAYOUTS.HORIZONTAL,
          xLabel: 'Total',
          yLabel: 'Cities',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
              color: {
                Particles: 'yellow',
                Temperature: 'purple',
              },
            },
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
              // colors: COLORS,
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
            },
          ],
          categoryDataSourceId: 'city',
        })}
        values={barChartData.quarters.filter((a) => a.quarter === '2020-Q2')}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true }}
      />
    </div>
  );
};

GroupedBarHorizontal.story = {
  name: 'Grouped bar - Horizontal',
};

export const StackedBarVertical = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="stacked-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          xLabel: 'Cities',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
              // colors: COLORS,
            },
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
              // colors: COLORS,
            },
            {
              dataSourceId: 'emissions',
              label: 'Emission',
            },
          ],
          categoryDataSourceId: 'city',
        })}
        values={barChartData.quarters.filter((a) => a.quarter === '2020-Q3')}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true }}
      />
    </div>
  );
};

StackedBarVertical.story = {
  name: 'Stacked bar - Vertical',
};

export const StackedBarHorizontal = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="stacked-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.HORIZONTAL,
          xLabel: 'Total',
          yLabel: 'Cities',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
              // colors: COLORS,
            },
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
              // colors: COLORS,
            },
            {
              dataSourceId: 'emissions',
              label: 'Emission',
            },
          ],
          categoryDataSourceId: 'city',
        })}
        values={barChartData.quarters.filter((a) => a.quarter === '2020-Q4')}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true }}
      />
    </div>
  );
};

StackedBarHorizontal.story = {
  name: 'Stacked bar - Horizontal',
};

export const StackedBarTimeSeries = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles / emissions over 4 days')}
        id="stacked-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          xLabel: 'Dates',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
              // colors: COLORS,
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
              // colors: COLORS,
            },
          ],
          timeDataSourceId: 'timestamp',
        })}
        values={barChartData.timestamps}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

StackedBarTimeSeries.story = {
  name: 'Stacked bar - Time series',
};

export const StackedBarTimeSeriesWithCategories = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles by city over time')}
        id="stacked-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          xLabel: 'Dates',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              // colors: COLORS,
            },
          ],
          timeDataSourceId: 'timestamp',
          categoryDataSourceId: 'city',
        })}
        values={barChartData.timestamps}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

StackedBarTimeSeriesWithCategories.story = {
  name: 'Stacked bar - Time series with categories',
};

export const WithZoomBar = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.LARGEWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles by city over time')}
        id="stacked-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          xLabel: 'Dates',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
            },
          ],
          timeDataSourceId: 'timestamp',
          categoryDataSourceId: 'city',
          zoomBar: {
            enabled: true,
            axes: 'top',
            view: select('view', ['slider_view', 'graph_view'], 'slider_view'),
          },
        })}
        values={barChartData.timestamps}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

WithZoomBar.story = {
  name: 'with zoomBar',
};

export const NoData = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.LARGEWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="simple-sample-no-data"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        i18n={object('i18n', {
          noDataLabel: 'No data for this card.',
        })}
        content={object('content', {
          xLabel: 'Cities',
          yLabel: 'Particles',
          series: [
            {
              dataSourceId: 'particles',
              // colors: COLORS,
            },
          ],
          categoryDataSourceId: 'city',
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          type: BAR_CHART_TYPES.SIMPLE,
        })}
        values={barChartData.quarters.filter((a) => a.quarter === 'NOT_VALID')}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

NoData.story = {
  name: 'No data',
};

export const IsExpanded = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles by city over time')}
        id="stacked-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', true)}
        content={object('content', {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          xLabel: 'Dates',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              // colors: COLORS,
            },
          ],
          timeDataSourceId: 'timestamp',
          categoryDataSourceId: 'city',
          zoomBar: {
            enabled: true,
            axes: 'top',
          },
        })}
        values={barChartData.timestamps}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

IsExpanded.story = {
  name: 'isExpanded',
};

export const IsEditable = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="grouped-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', true)}
        isExpanded={boolean('isExpandable', false)}
        content={object('content', {
          type: BAR_CHART_TYPES.GROUPED,
          xLabel: 'Cities',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
              color: 'blue',
            },
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
            },
          ],
          categoryDataSourceId: 'city',
        })}
        values={[]}
        size={size}
        onCardAction={action('onCardAction')}
      />
    </div>
  );
};

IsEditable.story = {
  name: 'isEditable',
};
