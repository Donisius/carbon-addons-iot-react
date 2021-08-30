import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListBuilderModule } from './list-builder.module';
import { ListModule } from '../list/list.module';
import { ButtonModule, IconModule } from 'carbon-components-angular';
import { AIListBuilderItem } from './list-builder-item.class';

storiesOf('Components/List builder', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule, ListBuilderModule, ListModule, IconModule],
      declarations: [],
    })
  )
  .addDecorator(withKnobs)
  .add('Two column multi', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [items]="items"
          [listProps]="listProps"
          [selectedListProps]="selectedListProps"
          editingStyle="two-column-multi">
        </ai-list-builder>
      </div>
    `,
    props: {
      items: [
        new AIListBuilderItem({ value: 'Item 1', isSelectable: true, selected: false, addedState: null, addedItemProps: {isDraggable: true}, items: [
          new AIListBuilderItem({ value: 'Item 2', isSelectable: true, selected: false, addedItemProps: {isDraggable: true}, addedState: null })
        ] }),
        new AIListBuilderItem({ value: 'Item 2', isSelectable: true, selected: false, addedItemProps: {isDraggable: true}, addedState: null }),
        new AIListBuilderItem({ value: 'Item 3', isSelectable: true, selected: false, addedItemProps: {isDraggable: true}, addedState: null }),
        new AIListBuilderItem({ value: 'Item 4', isSelectable: true, selected: false, addedItemProps: {isDraggable: true}, addedState: null }),
      ],
      listProps: {
        selectionType: 'multi'
      },
      selectedListProps: {
        itemsDraggable: true
      }
    }
  }))
  .add('Two column', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [items]="items">
        </ai-list-builder>
      </div>
    `,
    props: {
      items: [
        new AIListBuilderItem({ value: 'Item 1' }),
        new AIListBuilderItem({ value: 'Item 2' }),
        new AIListBuilderItem({ value: 'Item 3' }),
        new AIListBuilderItem({ value: 'Item 4' }),
      ]
    }
  }))
