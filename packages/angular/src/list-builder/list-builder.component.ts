import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IconService } from 'carbon-components-angular';
import { AIListComponent } from '../list/ai-list.component';
import { AIListItem } from '../list/list-item/ai-list-item.class';
import { ArrowRight16, Subtract16 } from '@carbon/icons';
import { EditingStyle } from './list-builder-types';

@Component({
  selector: 'ai-list-builder',
  template: `
    <div class='iot--list-builder__container'>
      <div class='iot--list-builder__all'>
        <ai-list
          #allItemsList
          [title]='allItemsListTitle'
          [selectionType]='editingStyle === "two-column-multi" ? "multi" : null'
          [items]="items"
          [hasSearch]="allItemsListHasSearch"
          (selected)="handleSelect($event)">
        </ai-list>
      </div>
      <div class='iot--list-builder__selected'>
        <ai-list
          #selectedItemsList
          [title]='selectedItemsListTitle'
          [itemsDraggable]='editingStyle === "two-column-multi"'
          [items]="selectedItems"
          [hasSearch]="selectedItemsListHasSearch">
        </ai-list>
      </div>
    </div>
  `
})
export class AIListBuilderComponent implements AfterViewInit, OnInit {
  @Input() items: AIListItem[] = [];
  @Input() selectedItems: AIListItem[] = [];

  @Input() allItemsListTitle = 'All items';
  @Input() selectedItemsListTitle = 'Selected items';

  @Input() allItemsListHasSearch = true;
  @Input() selectedItemsListHasSearch = false;

  @Input() editingStyle: EditingStyle = EditingStyle.TWO_COLUMN;

  /**
   * Additional list item props to pass into the 'All items' list.
   * TODO: Link docs for list item interface.
   */
  @Input() listProps: any = {};
  /**
   * Additional list item props to pass into the 'Selected items' list.
   * TODO: Link docs for list item interface.
   */
  @Input() selectedListProps: any = {};

  @ViewChild('addButton') @Input() addButton: TemplateRef<any>;
  @ViewChild('removeButton') @Input() removeButton: TemplateRef<any>;

  @ViewChild('allItemsList') allItemsListComponent: AIListComponent;
  @ViewChild('selectedItemsList') selectedItemsListComponent: AIListComponent;

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Subtract16);
    this.iconService.register(ArrowRight16);
  }

  ngAfterViewInit() {
    Object.assign(this.allItemsListComponent, this.allItemsListComponent, this.listProps);
    Object.assign(this.selectedItemsListComponent, this.selectedItemsListComponent, this.selectedListProps);

    if (this.editingStyle === EditingStyle.TWO_COLUMN) {
      this.initializeRowActions(this.items);
    }
  }

  addAddButton(item: AIListItem) {
    item.rowActions = this.addButton;
    item.rowActionsContext = {
      $implicit: {
        onClick: () => { this.handleAdd(item); }
      }
    }
  }

  addRemoveButton(item: AIListItem) {
    item.rowActions = this.removeButton;
    item.rowActionsContext = {
      $implicit: {
        onClick: () => { this.handleRemove(item); }
      }
    }
  }

  handleAdd(item: AIListItem) {
    const newItem = new AIListItem(item);

    if (this.editingStyle === EditingStyle.TWO_COLUMN_MULTI) {
      newItem.isDraggable = true;
      newItem.isSelectable = false;
      newItem.selected = false;
    } else {
      const index = this.items.findIndex((listItem) => item.id === listItem.id);
      this.items.splice(index, 1);
    }

    this.addRemoveButton(newItem);
    this.selectedItems.push(newItem);
  }

  handleRemove(item: AIListItem) {
    const newItem = new AIListItem(item);

    if (this.editingStyle === EditingStyle.TWO_COLUMN_MULTI) {
      this.items.forEach((listItem) => {
        if (listItem.id === item.id) {
          listItem.selected = false;
        }
      });
    } else {
      this.addAddButton(newItem);
      this.items.push(newItem);
    }

    const index = this.selectedItems.findIndex((listItem) => item.id === listItem.id);
    this.selectedItems.splice(index, 1);
  }

  handleSelect(item: AIListItem) {
    if (item.selected) {
      this.handleAdd(item);
    } else {
      this.handleRemove(item);
    }
  }

  protected initializeRowActions(items: AIListItem[]) {
    items.forEach((item) => {
      if (item.hasChildren()) {
        this.initializeRowActions(item.items);
      }

      if (item.rowActions === undefined) {
        this.addAddButton(item);
      }
    });
  }
}
