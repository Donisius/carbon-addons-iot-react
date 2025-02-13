import React, { useState, useRef } from 'react';

import { Tag, Button } from '../../index';

import FilterTags from './FilterTags';

export const tagData = [
  {
    id: 'tag-one',
    text: 'Hello World',
    onClose: () => console.log('closed tag-one'),
    type: 'red',
  },
  {
    id: 'tag-two',
    text: 'Hello Space',
    onClose: () => console.log('closed tag-two'),
    type: 'blue',
  },
  {
    id: 'tag-three',
    text: 'Hello Sun',
    onClose: () => console.log('closed tag-three'),
    type: 'red',
  },
  {
    id: 'tag-four',
    text: 'Hello Daughter',
    onClose: () => console.log('closed tag-four'),
    type: 'red',
  },
];

const TagWrapper = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div {...props} ref={ref} style={{ border: '1px solid red' }}>
      {children}
    </div>
  );
});
const StatefulFilterTags = ({ tags }) => {
  const index = useRef(0);
  const [renderedTags, setRenderedTags] = useState(tags);
  const handleOnClose = (id) => {
    setRenderedTags(renderedTags.filter((x) => x.id !== id));
    tags.filter((x) => x.id === id)[0].onClose();
  };
  const handleOnClick = () => {
    const newTag = {
      id: `tag-${index.current}`,
      text: `tag-${index.current}`,
      onClose: () => console.log(`Close ${index.current}`),
      type: 'red',
    };
    index.current += 1;
    setRenderedTags([newTag, ...renderedTags]);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Button onClick={() => handleOnClick()}>Add tag</Button>
      <FilterTags>
        {renderedTags.map((tag) => (
          <Tag
            key={`tag-${tag.id}`}
            filter
            type={tag.type}
            title="Clear Filter"
            style={{ marginRight: '1rem' }}
            onClose={() => handleOnClose(tag.id)}
          >
            {tag.text}
          </Tag>
        ))}
      </FilterTags>
    </div>
  );
};

export default {
  title: 'Watson IoT/FilterTags',

  parameters: {
    component: FilterTags,
  },

  excludeStories: ['tagData'],
};

export const DefaultExample = () => <StatefulFilterTags tags={tagData} />;

DefaultExample.story = {
  parameters: {
    info: {
      propTables: [FilterTags],
      propTablesExclude: [StatefulFilterTags],
    },
  },
};

export const WithHasOverflowSetToFalse = () => (
  <FilterTags hasOverflow={false}>
    {tagData.map((tag) => (
      <Tag
        key={`tag-${tag.id}`}
        filter
        type={tag.type}
        title="Clear Filter"
        style={{ marginRight: '1rem' }}
      >
        {tag.text}
      </Tag>
    ))}
  </FilterTags>
);

WithHasOverflowSetToFalse.story = {
  name: 'With hasOverflow set to false',

  parameters: {
    info: {
      propTables: [FilterTags],
      propTablesExclude: [Tag],
    },
  },
};

export const WithTagContainerProp = () => (
  <FilterTags hasOverflow={false} tagContainer={TagWrapper}>
    {tagData.map((tag) => (
      <Tag
        key={`tag-${tag.id}`}
        filter
        type={tag.type}
        title="Clear Filter"
        style={{ marginRight: '1rem' }}
      >
        {tag.text}
      </Tag>
    ))}
  </FilterTags>
);

WithTagContainerProp.story = {
  name: 'With tagContainer prop',

  parameters: {
    info: {
      propTables: [FilterTags],
      propTablesExclude: [Tag],
    },
  },
};
