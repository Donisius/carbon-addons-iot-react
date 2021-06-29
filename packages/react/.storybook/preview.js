import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { configureActions } from '@storybook/addon-actions';
import { initializeRTL } from 'storybook-addon-rtl';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import theme from './theme';

initializeRTL();

import Container from './Container';

configureActions({
  depth: 3,
});

addParameters({
  options: {
    theme: theme,
    showRoots: true,
    storySort: (a, b) =>
      a[1].kind.replace(/☢️-|🚫-|⚠️-/i, '') === b[1].kind.replace(/☢️-|🚫-|⚠️-/i, '')
        ? 0
        : a[1].id
            .replace(/☢️-|🚫-|⚠️-/i, '')
            .localeCompare(b[1].id.replace(/☢️-|🚫-|⚠️-/i, ''), undefined, { numeric: true }),
  },
});

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});
addDecorator((story) => <Container story={story} />);
addDecorator(withA11y);
addDecorator(withKnobs);
