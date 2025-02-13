import React from 'react';
import { action } from '@storybook/addon-actions';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import StoryNotice, { deprecatedStoryTitle } from '../../internal/StoryNotice';

import PageHero from './PageHero';

const commonPageHeroProps = {
  title: 'Your Devices',
  blurb:
    'Your data lake displays a detailed view of the entity types that are connected in Watson IoT Platform. To explore the metrics and dimensions of your entities in more detail, select Entities. To start applying calculations and analyzing your entity data, select Data.',
  big: true,
  rightContent: <div style={{ textAlign: 'right' }}>Right Content</div>,
};

export default {
  title: 'Watson IoT/🚫 PageHero',
  decorators: [(storyFn) => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>],
};

export const Deprecated = () => (
  <StoryNotice componentName="PageHero" replacementComponentName="Hero" />
);
Deprecated.story = {
  name: deprecatedStoryTitle,
};

export const Normal = () => <PageHero {...commonPageHeroProps} />;

Normal.story = {
  name: 'normal',
};

export const NormalWithContentSwitcher = () => (
  <PageHero
    {...commonPageHeroProps}
    switcher={{
      onChange: action('onChange'),
      selectedIndex: 1,
      options: [
        {
          id: 'allDevices',
          text: 'All Devices',
        },
        {
          id: 'diagnose',
          text: 'Diagnose',
        },
      ],
    }}
  />
);

NormalWithContentSwitcher.story = {
  name: 'normal with content switcher',
};

export const WithSection = () => <PageHero {...commonPageHeroProps} section="Explore" />;

WithSection.story = {
  name: 'with section',
};

export const HasBreadcrumb = () => (
  <PageHero {...commonPageHeroProps} crumb={<div>breadcrumb/mybread</div>} />
);

HasBreadcrumb.story = {
  name: 'has breadcrumb',
};

export const HasLeftContent = () => (
  <PageHero {...commonPageHeroProps} leftContent={<div>Left Content</div>} />
);

HasLeftContent.story = {
  name: 'has left content',
};
