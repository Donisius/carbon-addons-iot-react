import { Component, Inject } from '@angular/core';
import { BaseModal, ModalService, TableHeaderItem } from 'carbon-components-angular';
import { AIListItem } from '@ai-apps/angular/list';
import { AIListBuilderItem, AIListBuilderModel } from '@ai-apps/angular/list-builder';
import { AITableModel } from '../table-model.class';

@Component({
  selector: 'ai-column-customization-modal',
  template: `
    <ibm-modal [open]="open" [hasScrollingContent]="false" (overlaySelected)="closeModal()">
      <ibm-modal-header (closeSelect)="closeModal()">
        <h3>Customize columns</h3>
        <p>
          Select the available columns to be displayed on the table. Drag the selected columns to
          reorder them
        </p>
      </ibm-modal-header>
      <section ibmModalContent [hasForm]="true">
        <ai-list-builder
          [model]="listBuilderModel"
          addingMethod="multi-select"
          [listProps]="listProps"
          [addedItemsListProps]="addedItemsListProps"
        >
        </ai-list-builder>
      </section>
      <ibm-modal-footer>
        <button class="bx--btn bx--btn--secondary" (click)="closeModal()">Cancel</button>
        <button class="bx--btn bx--btn--primary" modal-primary-focus (click)="updateColumns()">
          Save
        </button>
      </ibm-modal-footer>
    </ibm-modal>
  `,
})
export class AIColumnCustomizationModal extends BaseModal {
  listBuilderModel = new AIListBuilderModel();

  protected _model: AITableModel;

  constructor(
    @Inject('model') public model = new AITableModel(),
    @Inject('listProps')
    public listProps = {
      title: 'Available columns',
    },
    @Inject('addedItemsListProps')
    public addedItemsListProps = {
      title: 'Selected columns',
    },
    protected modalService: ModalService
  ) {
    super();
    this.listBuilderModel.items = this.headerToListItems(model.header);
  }

  updateColumns() {
    this.moveColumns(this.listBuilderModel.addedItems);
    this.listBuilderModel.items = this.headerToListItems(this.model.header);
    this.closeModal();
  }

  protected headerToListItems(header: TableHeaderItem[][]) {
    const availableHeaderItems = header.map((headerRow) =>
      headerRow.filter((headerItem) => headerItem !== null).map((headerItem) => headerItem)
    );

    return this.createListItems(header[0], availableHeaderItems);
  }

  protected createListItems(
    headerRow: TableHeaderItem[],
    availableHeaderItems: TableHeaderItem[][],
    rowIndex = 0
  ) {
    return headerRow
      .filter((headerItem) => headerItem !== null)
      .map((headerItem) => {
        const listBuilderItem = new AIListBuilderItem({
          value: headerItem.data,
          isSelectable: true,
          addOnSelect: true,
          addedState: null,
          itemMetaData: {
            headerItem: headerItem,
          },
          addedItemProps: {
            itemMetaData: {
              headerItem: headerItem,
            },
            expanded: false,
            isDraggable: true,
          },
        });

        const colSpan = headerItem?.colSpan || 1;
        const rowSpan = headerItem?.rowSpan || 1;

        if (rowIndex + rowSpan >= this.model.header.length) {
          return listBuilderItem;
        }

        let spaceLeft = colSpan;
        const availableChildren = availableHeaderItems[rowIndex + rowSpan];
        const children = [];

        while (spaceLeft > 0 && availableChildren.length) {
          const nextChild = availableChildren.shift();
          spaceLeft -= nextChild?.colSpan || 1;
          children.push(nextChild);
        }

        listBuilderItem.items = this.createListItems(
          children,
          availableHeaderItems,
          rowIndex + rowSpan
        );

        return listBuilderItem;
      });
  }

  protected listItemsToHeader(listItems: AIListItem[]) {
    // fill([]) gives each row the same array reference.
    const header = new Array(this.model.header.length).fill(0).map(() => []);
    this.createHeader(listItems, header);
    const maxLength = Math.max(
      ...header.map((headerRow) =>
        headerRow.reduce((totalLength, headerItem) => totalLength + headerItem.colSpan, 0)
      )
    );
    header.forEach((headerRow) => {
      const rowLength = headerRow.reduce(
        (totalLength, headerItem) => totalLength + headerItem.colSpan,
        0
      );
      headerRow.push(...new Array(maxLength - rowLength).fill(null));
    });
    return header;
  }

  protected createHeader(listItems: AIListItem[], headers: any[][], rowIndex = 0) {
    listItems.forEach((listItem) => {
      headers[rowIndex].push(listItem.itemMetaData.headerItem);

      if (listItem.hasChildren()) {
        this.createHeader(
          listItem.items,
          headers,
          rowIndex + (listItem.itemMetaData.headerItem?.rowSpan || 1)
        );
      }
    });
  }

  protected moveColumns(items: AIListItem[]) {
    const newHeader = this.listItemsToHeader(items);

    if (!this.isHeaderValid(newHeader)) {
      return;
    }

    for (let i = 0; i < this.model.header[0].length; i++) {
      const headerItem = this.model.header[0][i];
      if (headerItem !== null && !newHeader[0].includes(headerItem)) {
        this.model.deleteColumn(i);
      }
    }

    // Move items to their new positions
    newHeader.forEach((newHeaderRow, rowIndex) => {
      const headerRow = this.model.header[rowIndex];

      newHeaderRow.forEach((newHeaderItem, colIndex) => {
        if (newHeaderItem === null) {
          return;
        }

        const prevItem = colIndex > 0 ? newHeaderRow[colIndex - 1] : newHeaderRow[colIndex];

        const indexFrom = headerRow.findIndex((headerItem) => headerItem === newHeaderItem);
        let indexTo =
          headerRow.findIndex((headerItem) => headerItem === prevItem) + (colIndex > 0 ? 1 : 0);

        if (indexFrom !== indexTo) {
          this.model.moveColumn(indexFrom, indexTo, rowIndex);
        }
      });
    });
  }

  protected isHeaderValid(header: TableHeaderItem[][]) {
    // This keeps track of the projected width of all header rows.
    // This should include the total `colSpan` of all items in the header row
    // and the added length from higher level items with `rowSpan`s that
    // go past each particular row.
    const headerProjectedWidths = new Array(header.length).fill(0);

    header.forEach((headerRow, rowIndex) => {
      headerRow.forEach((headerItem) => {
        if (headerItem === null) {
          return;
        }
        const colSpan = headerItem?.colSpan || 1;
        const rowSpan = headerItem?.rowSpan || 1;
        headerProjectedWidths[rowIndex] += colSpan;
        for (let i = 1; i < rowSpan; i++) {
          headerProjectedWidths[rowIndex + i] += colSpan;
        }
      });
    });

    // In order for `header` to be valid, all rows must
    // have the same projected width.
    return headerProjectedWidths.every((width) => width === headerProjectedWidths[0]);
  }
}
