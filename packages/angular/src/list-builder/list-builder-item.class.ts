import { TemplateRef } from '@angular/core';
import { AIListItem } from '../list/list-item/ai-list-item.class';

export class AIListBuilderItem extends AIListItem {
  items: AIListBuilderItem[];
  addedState: 'disabled' | 'hide' | null = 'hide';
  added = false;

  add() {
    this.select(true, true);
  }

  remove() {
    this.select(false, true);
  }

  addedRowActions: TemplateRef<any>;
  addedRowActionsContext = {
    removeFunction: () => this.remove()
  };

  rowActionsContext = {
    addFunction: () => this.add()
  }

  addedItemProps: any;

  constructor(rawData: any) {
    super();
    const data = {
      ...(rawData ? rawData : {}),
      items:
        rawData?.items && rawData.items.length > 0
          ? rawData.items.map((item: any) =>
              item instanceof AIListBuilderItem ? item : new AIListBuilderItem(item)
            )
          : [],
    };
    Object.assign(this, {}, data);
  }

  select(selected = true, shouldEmit = false) {
    this.selected = selected;

    if (shouldEmit) {
      this.onSelect.emit(this.selected);
    }

    if (this.addedState === 'disabled') {
      this.disabled = this.selected;
    }
  }

  includes(searchString: string) {
    return (
      (this.addedState !== 'hide' || !this.selected) &&
      (this.value.toLowerCase().includes(searchString.toLowerCase()) ||
      (this.secondaryValue !== undefined &&
        this.secondaryValue !== null &&
        this.secondaryValue.toLowerCase().includes(searchString.toLowerCase())) ||
      this.items.some((listItem) => listItem.includes(searchString)))
    );
  }

  createAddedItem(rowActions: TemplateRef<any>) {
    return new AIListBuilderItem({
      ...this,
      selected: false,
      disabled: false,
      isSelectable: false,
      ...this.addedItemProps,
      includes: (searchString: string) => (
        this.selected &&
        (this.value.toLowerCase().includes(searchString.toLowerCase()) ||
        (this.secondaryValue !== undefined &&
          this.secondaryValue !== null &&
          this.secondaryValue.toLowerCase().includes(searchString.toLowerCase())) ||
        this.items.some((listItem) => listItem.includes(searchString)))
      ),
      rowActions: this.addedRowActions !== undefined ? this.addedRowActions : rowActions,
      rowActionsContext: this.addedRowActionsContext,
      items: this.hasChildren() ? this.items.map((item) => item.createAddedItem(rowActions)) : []
    })
  }
}
