/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, text } from '@storybook/addon-knobs';

import { CopyButton } from '.';

const props = () => ({
  feedback: text('The text shown upon clicking (feedback)', 'Copied!'),
  feedbackTimeout: number('How long the text is shown upon clicking (feedbackTimeout)', 3000),
  iconDescription: text('Feedback icon description (iconDescription)', 'Copy to clipboard'),
  onClick: action('onClick'),
});

export default {
  title: 'CopyButton',
  decorators: [withKnobs],

  parameters: {
    component: CopyButton,
  },
};

export const Default = () => <CopyButton {...props()} />;

Default.parameters = {
  info: {
    text:
      'The copy button can be used when the user needs to copy information, such as a code snippet, to their clipboard.',
  },
};
