/* eslint-disable no-useless-escape */
import { barChartData } from '../../utils/barChartDataSample';
import { BAR_CHART_LAYOUTS, BAR_CHART_TYPES } from '../../constants/LayoutConstants';

import {
  mapValuesToAxes,
  formatChartData,
  formatColors,
  generateTableColumns,
  formatTableData,
  handleTooltip,
} from './barChartUtils';

describe('barChartUtils', () => {
  const formattedTimebasedChartData = [
    {
      date: new Date('2020-02-09T16:23:45.000Z'),
      group: 'Particles',
      key: 1581265425000,
      value: 447,
    },
    {
      date: new Date('2020-02-09T16:23:45.000Z'),
      group: 'Emissions',
      key: 1581265425000,
      value: 120,
    },
    {
      date: new Date('2020-02-10T16:23:45.000Z'),
      group: 'Particles',
      key: 1581351825000,
      value: 450,
    },
    {
      date: new Date('2020-02-10T16:23:45.000Z'),
      group: 'Emissions',
      key: 1581351825000,
      value: 150,
    },
    {
      date: new Date('2020-02-11T16:23:45.000Z'),
      group: 'Particles',
      key: 1581438225000,
      value: 512,
    },
    {
      date: new Date('2020-02-11T16:23:45.000Z'),
      group: 'Emissions',
      key: 1581438225000,
      value: 170,
    },
    {
      date: new Date('2020-02-12T16:23:45.000Z'),
      group: 'Particles',
      key: 1581524625000,
      value: 565,
    },
    {
      date: new Date('2020-02-12T16:23:45.000Z'),
      group: 'Emissions',
      key: 1581524625000,
      value: 200,
    },
  ];

  it('mapValuesToAxes returns axes for non-timebased group charts ', () => {
    // check horizontal layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.HORIZONTAL, 'city', null, BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'key',
    });
    // check vertical layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.VERTICAL, 'city', null, BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'key',
      leftAxesMapsTo: 'value',
    });
  });

  it('mapValuesToAxes returns axes for timebased group charts ', () => {
    // check horizontal layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.HORIZONTAL, 'city', 'timestamp', BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'date',
    });
    // check vertical layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.VERTICAL, 'city', 'timestamp', BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'date',
      leftAxesMapsTo: 'value',
    });
  });

  it('mapValuesToAxes returns axes for non-timebased and non-group charts AKA simple', () => {
    // check horizontal layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.HORIZONTAL, null, null, BAR_CHART_TYPES.SIMPLE)
    ).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'group',
    });
    // check vertical layout
    expect(mapValuesToAxes(BAR_CHART_LAYOUTS.VERTICAL, null, null, BAR_CHART_TYPES.SIMPLE)).toEqual(
      {
        bottomAxesMapsTo: 'group',
        leftAxesMapsTo: 'value',
      }
    );
  });

  it('formatChartData returns formatted data for group-based chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
        label: 'Particles',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.quarters.filter(a => a.quarter === '2020-Q3'),
        'city',
        null,
        BAR_CHART_TYPES.GROUPED
      )
    ).toEqual([
      {
        group: 'Particles',
        key: 'Amsterdam',
        value: 512,
      },
      {
        group: 'Particles',
        key: 'New York',
        value: 442,
      },
      {
        group: 'Particles',
        key: 'Bangkok',
        value: 397,
      },
      {
        group: 'Particles',
        key: 'San Francisco',
        value: 270,
      },
    ]);
  });

  it('formatChartData returns formatted data for time-based and group-based chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
        label: 'Particles',
      },
      {
        dataSourceId: 'emissions',
        label: 'Emissions',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.timestamps.filter(t => t.city === 'Amsterdam'),
        null,
        'timestamp',
        BAR_CHART_TYPES.STACKED
      )
    ).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Particles',
        key: 1581265425000,
        value: 447,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581265425000,
        value: 120,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Particles',
        key: 1581351825000,
        value: 450,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581351825000,
        value: 150,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Particles',
        key: 1581438225000,
        value: 512,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581438225000,
        value: 170,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Particles',
        key: 1581524625000,
        value: 565,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581524625000,
        value: 200,
      },
    ]);
  });

  it('formatChartData returns formatted data for simple, non-time and non-group chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.quarters.filter(q => q.quarter === '2020-Q1'),
        'city',
        null,
        BAR_CHART_TYPES.SIMPLE
      )
    ).toEqual([
      {
        group: 'Amsterdam',
        value: 447,
      },
      {
        group: 'New York',
        value: 528,
      },
      {
        group: 'Bangkok',
        value: 435,
      },
      {
        group: 'San Francisco',
        value: 388,
      },
    ]);
  });

  it('formatChartData returns formatted data for time-based, non-group chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
        label: 'Particles',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.timestamps.filter(t => t.city === 'Amsterdam'),
        null,
        'timestamp',
        BAR_CHART_TYPES.SIMPLE
      )
    ).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Particles',
        value: 447,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Particles',
        value: 450,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Particles',
        value: 512,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Particles',
        value: 565,
      },
    ]);
  });

  it('formatChartData doesnt return null values', () => {
    const series = [
      {
        dataSourceId: 'particles',
      },
    ];
    const nullData = [
      {
        quarter: '2020-Q1',
        city: 'Amsterdam',
        particles: null,
      },
      {
        quarter: '2020-Q1',
        city: 'New York',
        particles: 100,
      },
    ];
    // check horizontal layout
    expect(formatChartData(series, nullData, 'city', null, BAR_CHART_TYPES.SIMPLE)).toEqual([
      {
        group: 'New York',
        value: 100,
      },
    ]);
  });

  it('formatColors returns correct format if color is string', () => {
    const series = [
      {
        dataSourceId: 'particles',
        color: 'blue',
        label: 'Particles',
      },
      {
        dataSourceId: 'temperature',
        color: 'yellow',
        label: 'Temperature',
      },
    ];

    const uniqueDatasetNames = ['Particles', 'Temperature'];

    expect(formatColors(series, uniqueDatasetNames)).toEqual({
      identifier: 'group',
      scale: { Particles: 'blue', Temperature: 'yellow' },
    });
  });

  it('formatColors returns correct format if color is array', () => {
    const series = [
      {
        dataSourceId: 'particles',
        color: ['blue', 'red', 'green'],
        label: 'Particles',
      },
    ];

    const uniqueDatasetNames = ['Particles', 'Temperature', 'Emissions'];

    expect(formatColors(series, uniqueDatasetNames)).toEqual({
      identifier: 'group',
      scale: { Particles: 'blue', Temperature: 'red', Emissions: 'green' },
    });
  });

  it('formatColors returns correct format if color is object', () => {
    const series = [
      {
        dataSourceId: 'particles',
        color: { Particles: 'blue', Temperature: 'red' },
        label: 'Particles',
      },
      {
        dataSourceId: 'temperature',
        label: 'Temperature',
      },
    ];

    const uniqueDatasetNames = ['Particles', 'Temperature'];

    expect(formatColors(series, uniqueDatasetNames)).toEqual({
      identifier: 'group',
      scale: { Particles: 'blue', Temperature: 'red' },
    });
  });

  it('formatColors returns default colors if no color is provided', () => {
    const series = [
      {
        dataSourceId: 'particles',
        label: 'Particles',
      },
      {
        dataSourceId: 'temperature',
        label: 'Temperature',
      },
    ];

    const uniqueDatasetNames = ['Particles', 'Temperature'];

    expect(formatColors(series, uniqueDatasetNames)).toEqual({
      identifier: 'group',
      scale: { Particles: '#4589ff', Temperature: '#0072c3' },
    });
  });

  it('generateTableColumns returns time-based simple bar columns with placeholder text', () => {
    expect(
      generateTableColumns(
        'timestamp',
        null,
        BAR_CHART_TYPES.SIMPLE,
        ['Amsterdam', 'Austin', 'Miami'],
        'my default string'
      )
    ).toEqual([
      {
        id: 'timestamp',
        isSortable: true,
        name: 'Timestamp',
        type: 'TIMESTAMP',
      },
      {
        filter: {
          placeholderText: 'my default string',
        },
        id: 'Amsterdam',
        isSortable: true,
        name: 'Amsterdam',
      },
      {
        filter: {
          placeholderText: 'my default string',
        },
        id: 'Austin',
        isSortable: true,
        name: 'Austin',
      },
      {
        filter: {
          placeholderText: 'my default string',
        },
        id: 'Miami',
        isSortable: true,
        name: 'Miami',
      },
    ]);
  });

  it('generateTableColumns returns non-time-based simple bar columns', () => {
    expect(
      generateTableColumns(
        null,
        'city',
        BAR_CHART_TYPES.SIMPLE,
        ['Amsterdam', 'Austin', 'Miami'],
        null
      )
    ).toEqual([
      {
        id: 'Amsterdam',
        isSortable: true,
        name: 'Amsterdam',
      },
      {
        id: 'Austin',
        isSortable: true,
        name: 'Austin',
      },
      {
        id: 'Miami',
        isSortable: true,
        name: 'Miami',
      },
    ]);
  });

  it('generateTableColumns returns time-based group bar columns', () => {
    expect(
      generateTableColumns(
        'timestamp',
        'city',
        BAR_CHART_TYPES.GROUPED,
        ['Amsterdam', 'Austin', 'Miami'],
        null
      )
    ).toEqual([
      {
        id: 'timestamp',
        isSortable: true,
        name: 'Timestamp',
        type: 'TIMESTAMP',
      },
      {
        id: 'Amsterdam',
        isSortable: true,
        name: 'Amsterdam',
      },
      {
        id: 'Austin',
        isSortable: true,
        name: 'Austin',
      },
      {
        id: 'Miami',
        isSortable: true,
        name: 'Miami',
      },
    ]);
  });
  it('generateTableColumns returns non-time-based group bar columns', () => {
    expect(
      generateTableColumns(
        null,
        'city',
        BAR_CHART_TYPES.STACKED,
        ['Particles', 'Emissions', 'Temperature'],
        null
      )
    ).toEqual([
      {
        id: 'city',
        isSortable: true,
        name: 'City',
      },
      {
        id: 'Particles',
        isSortable: true,
        name: 'Particles',
      },
      {
        id: 'Emissions',
        isSortable: true,
        name: 'Emissions',
      },
      {
        id: 'Temperature',
        isSortable: true,
        name: 'Temperature',
      },
    ]);
  });

  it('formatTableData returns time-based data', () => {
    expect(
      formatTableData(
        'timestamp',
        null,
        BAR_CHART_TYPES.SIMPLE,
        barChartData.timestamps.filter(t => t.city === 'Amsterdam'),
        formattedTimebasedChartData
      )
    ).toEqual([
      {
        id: 'dataindex-0',
        isSelectable: false,
        values: {
          Emissions: 120,
          Particles: 447,
          timestamp: '02/09/2020 10:23',
        },
      },
      {
        id: 'dataindex-1',
        isSelectable: false,
        values: {
          Emissions: 150,
          Particles: 450,
          timestamp: '02/10/2020 10:23',
        },
      },
      {
        id: 'dataindex-2',
        isSelectable: false,
        values: {
          Emissions: 170,
          Particles: 512,
          timestamp: '02/11/2020 10:23',
        },
      },
      {
        id: 'dataindex-3',
        isSelectable: false,
        values: {
          Emissions: 200,
          Particles: 565,
          timestamp: '02/12/2020 10:23',
        },
      },
    ]);
  });

  it('formatTableData returns grouped non-timebased data', () => {
    const groupedFormattedData = [
      {
        group: 'Particles',
        key: 'Amsterdam',
        value: 512,
      },
      {
        group: 'Particles',
        key: 'New York',
        value: 442,
      },
      {
        group: 'Particles',
        key: 'Bangkok',
        value: 397,
      },
      {
        group: 'Particles',
        key: 'San Francisco',
        value: 270,
      },
    ];

    expect(
      formatTableData(
        null,
        'city',
        BAR_CHART_TYPES.GROUPED,
        barChartData.quarters.filter(a => a.quarter === '2020-Q3'),
        groupedFormattedData
      )
    ).toEqual([
      {
        id: 'dataindex-0',
        isSelectable: false,
        values: {
          Particles: 512,
          city: 'Amsterdam',
        },
      },
      {
        id: 'dataindex-1',
        isSelectable: false,
        values: {
          Particles: 442,
          city: 'New York',
        },
      },
      {
        id: 'dataindex-2',
        isSelectable: false,
        values: {
          Particles: 397,
          city: 'Bangkok',
        },
      },
      {
        id: 'dataindex-3',
        isSelectable: false,
        values: {
          Particles: 270,
          city: 'San Francisco',
        },
      },
    ]);
  });

  it('formatTableData returns simple non-timebased data', () => {
    const simpleFormattedData = [
      {
        group: 'Amsterdam',
        value: 512,
      },
      {
        group: 'New York',
        value: 442,
      },
      {
        group: 'Bangkok',
        value: 397,
      },
      {
        group: 'San Francisco',
        value: 270,
      },
    ];

    expect(
      formatTableData(
        null,
        'city',
        BAR_CHART_TYPES.SIMPLE,
        barChartData.quarters.filter(a => a.quarter === '2020-Q3'),
        simpleFormattedData
      )
    ).toEqual([
      {
        id: 'dataindex-1',
        isSelectable: false,
        values: {
          Amsterdam: 512,
          Bangkok: 397,
          'New York': 442,
          'San Francisco': 270,
        },
      },
    ]);
  });

  it('handleTooltip returns correct format if data is not time-based', () => {
    const simpleFormattedData = {
      group: 'San Francisco',
      value: 512,
      date: new Date(1581438225000),
    };

    const defaultTooltip = `<ul class='multi-tooltip'><li>
    <div class="datapoint-tooltip ">
      
      <p class="label">Cities </p>
      <p class="value">San Francisco</p>
    </div>
  </li><li>
    <div class="datapoint-tooltip ">
      
      <p class="label">Particles </p>
      <p class="value">512</p>
    </div>
  </li><li>
    <div class="datapoint-tooltip ">
      <a style="background-color: #4589ff" class="tooltip-color"></a>
      <p class="label">Group</p>
      <p class="value">Particles</p>
    </div>
  </li></ul>`;

    expect(
      handleTooltip(simpleFormattedData, defaultTooltip, undefined).replace(/\s+/g, '')
    ).toEqual(
      `<ul class="multi-tooltip"><li>
    <div class="datapoint-tooltip ">

      <p class="label">Cities </p>
      <p class="value">San Francisco</p>
    </div>
  </li><li>
    <div class="datapoint-tooltip ">

      <p class="label">Particles </p>
      <p class="value">512</p>
    </div>
  </li><li>
    <div class="datapoint-tooltip ">
      <a style="background-color: #4589ff" class="tooltip-color"></a>
      <p class="label">Group</p>
      <p class="value">Particles</p>
    </div>
  </li></ul>`.replace(/\s+/g, '')
    );
  });

  it('handleTooltip returns correct format if data is array', () => {
    const simpleFormattedData = [
      {
        group: 'Particles',
        value: 565,
        date: new Date(1581438225000),
      },
    ];

    const defaultTooltip = `<ul class='multi-tooltip'><li>
    <div class="datapoint-tooltip ">
      <p class="label">Dates </p>
      <p class="value">Feb 12, 2020</p>
    </div>
  </li><li>
    <div class="datapoint-tooltip ">
      <p class="label">Total </p>
      <p class="value">565</p>
    </div>
  </li><li>
    <div class="datapoint-tooltip ">
      <a style="background-color: #4589ff" class="tooltip-color"></a>
      <p class="label">Group</p>
      <p class="value">Particles</p>
    </div>
  </li></ul>`;

    expect(
      handleTooltip(simpleFormattedData, defaultTooltip, 'timestamp').replace(/\s+/g, '')
    ).toEqual(
      `<ul class="multi-tooltip"><li class="datapoint-tooltip">
            <p class="label">
              02/11/2020 10:23:45</p>
          </li><li>
    <div class="datapoint-tooltip ">
      <p class="label">Total </p>
      <p class="value">565</p>
    </div>
  </li><li>
    <div class="datapoint-tooltip ">
      <a style="background-color: #4589ff" class="tooltip-color"></a>
      <p class="label">Group</p>
      <p class="value">Particles</p>
    </div>
  </li></ul>`.replace(/\s+/g, '')
    );
  });
});
