import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListBuilderModule } from './list-builder.module';
import { AIListItem } from '../list/list-item/ai-list-item.class';
import { SelectionType } from '../list/list.types';
import { AppCutsomListBuilder } from './stories/app-custom-list-builder';
import { ListModule } from '../list/list.module';
import { ButtonModule, IconModule } from 'carbon-components-angular';

storiesOf('Components/List builder', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule, ListBuilderModule, ListModule, IconModule],
      declarations: [AppCutsomListBuilder],
    })
  )
  .addDecorator(withKnobs)
  .add('Two column multi', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [items]="items"
          editingStyle="two-column-multi">
        </ai-list-builder>
      </div>
    `,
    props: {
      items: [
        new AIListItem({ value: 'Item 1', isSelectable: true, selected: false }),
        new AIListItem({ value: 'Item 2', isSelectable: true, selected: false }),
        new AIListItem({ value: 'Item 3', isSelectable: true, selected: false }),
        new AIListItem({ value: 'Item 4', isSelectable: true, selected: false }),
      ]
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
        new AIListItem({ value: 'Item 1' }),
        new AIListItem({ value: 'Item 2' }),
        new AIListItem({ value: 'Item 3' }),
        new AIListItem({ value: 'Item 4' }),
      ]
    }
  }))
  .add('Custom list builder', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <app-custom-list-builder
          [items]="items">
        </app-custom-list-builder>
      </div>
    `,
    props: {
      items: [
        new AIListItem({ value: 'Item 1' }),
        new AIListItem({ value: 'Item 2' }),
        new AIListItem({ value: 'Item 3' }),
        new AIListItem({ value: 'Item 4' }),
      ]
    }
  }))
