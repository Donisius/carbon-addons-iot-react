import { Component, Input } from '@angular/core';
import { AIListItem } from '../../list/list-item/ai-list-item.class';
import { AIListBuilderComponent } from '../list-builder.component';

@Component({
  selector: 'app-custom-list-builder',
  template: `
    <div class='iot--list-builder__container'>
      <div class='iot--list-builder__all'>
        <ai-list
          #allItemsList
          [hasSearch]="true"
          title="All items"
          [items]="items">
        </ai-list>
      </div>
      <div class='iot--list-builder__selected'>
        <ai-list
          #selectedItemsList
          [items]="selectedItems"
          title="Selected items">
        </ai-list>
      </div>
    </div>

    <ng-template #addButton let-data>
      <button
        ibmButton='ghost'
        size='sm'
        [iconOnly]='true'
        (click)='data.onClick()'>
        <svg class='bx--btn__icon' ibmIcon='arrow--right' size='16'></svg>
      </button>
    </ng-template>

    <ng-template #removeButton let-data>
      <button
        ibmButton='ghost'
        size='sm'
        [iconOnly]='true'
        (click)='data.onClick()'>
        <svg class='bx--btn__icon' ibmIcon='subtract' size='16'></svg>
      </button>
    </ng-template>
  `,
})
export class AppCutsomListBuilder extends AIListBuilderComponent {
  @Input() items;
  @Input() selectedItems;

  handleAdd(item: AIListItem) {
    const newItem = new AIListItem(item);

    this.addRemoveButton(newItem);
    this.selectedItems.push(newItem);

    item.disabled = true;
  }

  handleRemove(item: AIListItem) {
    this.items.forEach((listItem) => {
      if (listItem.id === item.id) {
        listItem.disabled = false;
      }
    });

    const index = this.selectedItems.findIndex((listItem) => item.id === listItem.id);
    this.selectedItems.splice(index, 1);
  }
}
