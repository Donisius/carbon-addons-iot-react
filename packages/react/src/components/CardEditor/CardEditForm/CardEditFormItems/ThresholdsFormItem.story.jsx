import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { red60, green50, orange40 } from '@carbon/colors';
import { Checkmark24, MisuseOutline24 } from '@carbon/icons-react';

import ThresholdsFormItem from './ThresholdsFormItem';

export default {
  title: 'Watson IoT Experimental/☢️ CardEditor/CardEditFormItems/ThresholdFormItem',
  decorators: [withKnobs],
  parameters: {
    component: ThresholdsFormItem,
  },
  excludeStories: [],
};

export const DefaultExample = () => (
  <div style={{ width: '15rem' }}>
    <ThresholdsFormItem
      id="myThresholdsFormItem"
      selectedIcon={{ carbonIcon: <Checkmark24 />, name: 'Checkmark' }}
      selectedColor={{ carbonColor: red60, name: 'red60' }}
      onChange={(thresholds) => console.log(thresholds)}
    />
  </div>
);

export const ExampleWithInitialValues = () => (
  <div style={{ width: '15rem' }}>
    <ThresholdsFormItem
      id="myThresholdsFormItem"
      thresholds={[
        { comparison: '>', value: 0, icon: 'Warning', color: red60 },
        { comparison: '<', value: 5, icon: 'Warning', color: green50 },
        { comparison: '=', value: 20, icon: 'Warning', color: orange40 },
      ]}
      selectedIcon={{ carbonIcon: <MisuseOutline24 />, name: 'Misuse outline' }}
      onChange={(thresholds) => console.log(thresholds)}
    />
  </div>
);

DefaultExample.story = {
  parameters: {
    info: {
      propTables: [ThresholdsFormItem],
      propTablesExclude: [],
    },
  },
};
