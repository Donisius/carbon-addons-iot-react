import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IconService } from 'carbon-components-angular';
import { AIListComponent } from '../list/ai-list.component';
import { ArrowRight16, Subtract16 } from '@carbon/icons';
import { AIListBuilderItem } from './list-builder-item.class';

@Component({
  selector: 'ai-list-builder',
  template: `
    <div class='iot--list-builder__container'>
      <div class='iot--list-builder__all'>
        <ai-list
          #list
          [title]='listTitle'
          selectionType='multi'
          [items]="items"
          [hasSearch]="listHasSearch">
        </ai-list>
      </div>
      <div class='iot--list-builder__selected'>
        <ai-list
          #selectedItemsList
          [items]='selectedItems'
          [title]='selectedItemsListTitle'
          [hasSearch]="selectedItemsListHasSearch">
        </ai-list>
      </div>
    </div>

    <ng-template #addButton let-addFunction="addFunction">
      <button
        ibmButton='ghost'
        size='sm'
        [iconOnly]='true'
        (click)='addFunction()'>
        <svg class='bx--btn__icon' ibmIcon='arrow--right' size='16'></svg>
      </button>
    </ng-template>

    <ng-template #removeButton let-removeFunction="removeFunction">
      <button
        ibmButton='ghost'
        size='sm'
        [iconOnly]='true'
        (click)='removeFunction()'>
        <svg class='bx--btn__icon' ibmIcon='subtract' size='16'></svg>
      </button>
    </ng-template>
  `
})
export class AIListBuilderComponent implements AfterViewInit, OnInit {
  @Input() items: AIListBuilderItem[] = [];

  @Input() listTitle = 'All items';
  @Input() selectedItemsListTitle = 'Selected items';

  @Input() listHasSearch = true;
  @Input() selectedItemsListHasSearch = false;

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

  @ViewChild('list') listComponent: AIListComponent;
  @ViewChild('selectedItemsList') selectedItemsListComponent: AIListComponent;

  selectedItems: AIListBuilderComponent[] = [];

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Subtract16);
    this.iconService.register(ArrowRight16);
  }

  ngAfterViewInit() {
    Object.assign(this.listComponent, this.listComponent, this.listProps);
    Object.assign(this.selectedItemsListComponent, this.selectedItemsListComponent, this.selectedListProps);

    this.selectedItems = this.items.map(item => item.createAddedItem(this.removeButton));

    this.initializeRowActions(this.items);
  }

  protected initializeRowActions(items: AIListBuilderItem[]) {
    items.forEach((item) => {
      if (item.hasChildren()) {
        this.initializeRowActions(item.items);
      }

      if (!item.isSelectable) {
        item.rowActions = item.rowActions !== undefined ? item.rowActions : this.addButton;
      }
    });
  }
}
