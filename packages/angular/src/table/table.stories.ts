import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableHeaderItem } from 'carbon-components-angular';

import { AITableModel, AITableItem } from './table-model.class';
import { AITableModule } from './table.module';

const simpleModel = new AITableModel();

simpleModel.setHeader([
  [
    new TableHeaderItem({
      data: 'Name',
      rowSpan: 2,
    }),
    new TableHeaderItem({ data: 'hwer', colSpan: 2, sortable: false }),
  ],
  [new TableHeaderItem({ data: 'hwer1' }), new TableHeaderItem({ data: 'hwer2' })],
]);

simpleModel.setData([
  [
    new AITableItem({ data: 'Name 1' }),
    new AITableItem({ data: 'qwer' }),
    new AITableItem({ data: 'qwer1' }),
  ],
  [new AITableItem({ data: 'Name 3' }), new AITableItem({ data: 'zwer', colSpan: 2 }), null],
  [
    new AITableItem({ data: 'Name 2' }),
    new AITableItem({ data: 'swer' }),
    new AITableItem({ data: 'swer1' }),
  ],
  [
    new AITableItem({ data: 'Name 4' }),
    new AITableItem({ data: 'twer' }),
    new AITableItem({ data: 'twer1' }),
  ],
]);

storiesOf('Components/Table', module)
  .addDecorator(
    moduleMetadata({
      imports: [AITableModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => {
    return {
      template: `
			<ai-table
				[model]="model"
				[size]="size"
				[showSelectionColumn]="showSelectionColumn"
				[striped]="striped"
				[skeleton]="skeleton"
				[isDataGrid]="isDataGrid"
				(sort)="customSort($event)"
				(rowClick)="rowClick($event)">
			</ai-table>
		`,
      props: {
        model: simpleModel,
        size: select('size', { Small: 'sm', Short: 'sh', Normal: 'md', Large: 'lg' }, 'md'),
        showSelectionColumn: boolean('showSelectionColumn', true),
        striped: boolean('striped', true),
        isDataGrid: boolean('Data grid keyboard interactions', true),
        skeleton: boolean('Skeleton mode', false),
        rowClick: action('row clicked'),
        customSort: (index: number) => {
          if (simpleModel.getClosestHeader(index).sorted) {
            // if already sorted flip sorting direction
            simpleModel.getClosestHeader(index).ascending = simpleModel.getClosestHeader(
              index
            ).descending;
          }
          simpleModel.sort(index);
        },
      },
    };
  });
