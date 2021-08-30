import { TemplateRef } from '@angular/core';
import { AIListBuilderItem } from './list-builder-item.class';

export class AIListBuilderModel {
  items: AIListBuilderItem[];
  addedItems: AIListBuilderItem[];

  editingStyle: 'multi-select' | 'row-action' | 'drag';

  rowActions: TemplateRef<any>;
  addedItemRowActions: TemplateRef<any>;

  addedItemsProps: any;

  setItems(newItems: AIListBuilderItem[]) {
    if (!newItems || (Array.isArray(newItems) && newItems.length === 0)) {
      newItems = [];
    }

    this.items = newItems;
    this.items = this.items
    this.addedItems = this.items.map(item => item.createAddedItem(this.addedItemRowActions));
  }
}
