import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Add16, Add20, ArrowRight16 } from '@carbon/icons-react';

import { settings } from '../../../constants/Settings';
import { tableColumns } from '../Table.story';
import Table from '../Table';

import TableFoot from './TableFoot';

const { iotPrefix } = settings;

const ordering = [
  { columnId: 'a' },
  {
    columnId: 'b',
    isHidden: true,
  },
  { columnId: 'c' },
  { columnId: 'd' },
];

const selectData = [
  {
    id: 'option-A',
    text: 'option-A',
  },
  {
    id: 'option-B',
    text: 'option-B',
  },
  {
    id: 'option-C',
    text: 'option-C',
  },
];

const words = [
  'toyota',
  'helping',
  'whiteboard',
  'as',
  'can',
  'bottle',
  'eat',
  'chocolate',
  'pinocchio',
  'scott',
];
const getWord = (index, step = 1) => words[(step * index) % words.length];
const getSentence = (index) =>
  `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)} ${index}`;

const tableData = Array(20)
  .fill(0)
  .map((i, idx) => ({
    id: `row-${idx}`,
    values: {
      string: getSentence(idx),
      node: <Add20 />,
      date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
      select: selectData[idx % 3].id,
      number: idx * idx,
    },
    rowActions: [
      {
        id: 'drilldown',
        renderIcon: ArrowRight16,
        iconDescription: 'Drill in',
        labelText: 'Drill in',
        isOverflow: true,
      },
      {
        id: 'Add',
        renderIcon: Add16,
        iconDescription: 'Add',
        labelText: 'Add',
        isOverflow: true,
      },
    ],
  }));

describe('TableFoot', () => {
  it('shows aggregation label in first column unless that column has an aggregated value', () => {
    const label = 'Total';
    const tableTestId = 'table-test';
    const tableFootTestId = 'table-foot';
    const firstColumnTestId = `${tableFootTestId}-aggregation-${ordering[0].columnId}`;

    const { rerender } = render(
      <table>
        <TableFoot
          testID={tableFootTestId}
          tableState={{
            aggregations: { label, columns: [{ id: 'c', value: '10' }] },
            ordering,
          }}
        />
      </table>
    );

    expect(screen.getByTestId(firstColumnTestId).textContent).toEqual(label);

    rerender(
      <table>
        <TableFoot
          testID={tableFootTestId}
          tableState={{
            aggregations: { label, columns: [{ id: 'a', value: '10' }] },
            ordering,
          }}
        />
      </table>
    );

    expect(screen.getByTestId(firstColumnTestId).textContent).not.toEqual(label);

    const modifiedColumns = [
      {
        id: 'moreNumbers',
        name: 'More Numbers',
      },
      ...tableColumns,
    ];
    const modifiedData = tableData.map((data) => ({
      ...data,
      values: { moreNumbers: 1, ...data.values },
    }));
    rerender(
      <Table
        id={tableTestId}
        columns={modifiedColumns}
        data={modifiedData}
        options={{ hasAggregations: true }}
        view={{
          aggregations: {
            label,
            columns: [{ id: 'number' }, { id: 'moreNumbers' }],
          },
        }}
      />
    );
    const newFirstAggregationCell = screen.getByTestId(
      `${tableTestId}-${tableFootTestId}-aggregation-${modifiedColumns[0].id}`
    );
    expect(newFirstAggregationCell.textContent).not.toEqual(label);
    expect(newFirstAggregationCell.textContent).toEqual('20');
  });

  it('adds empty cells for rowExpension, rowSelection & rowActions', () => {
    const tableFootTestId = 'table-foot';
    const label = 'Total';
    const firstColumnTestId = `${tableFootTestId}-aggregation-${ordering[0].columnId}`;
    const thirdColumnTestId = `${tableFootTestId}-aggregation-${ordering[2].columnId}`;

    const { rerender, container } = render(
      <table>
        <TableFoot
          testID={tableFootTestId}
          options={{
            hasRowActions: true,
            hasRowExpansion: true,
            hasRowSelection: 'multi',
          }}
          tableState={{
            aggregations: {},
            ordering: [],
          }}
        />
      </table>
    );

    expect(container.querySelectorAll('tr').length).toEqual(1);
    expect(container.querySelectorAll('td').length).toEqual(3);
    rerender(
      <table>
        <TableFoot
          testID={tableFootTestId}
          options={{
            hasAggregations: true,
            hasRowActions: true,
            hasRowExpansion: true,
            hasRowSelection: 'multi',
          }}
          tableState={{
            aggregations: { label, columns: [{ id: 'c', value: '10' }] },
            ordering,
          }}
        />
      </table>
    );

    expect(screen.getByTestId(firstColumnTestId).textContent).toEqual(label);
    expect(screen.getByTestId(thirdColumnTestId).textContent).toEqual('10');
    expect(container.querySelectorAll('tr').length).toEqual(1);
    expect(container.querySelectorAll('td').length).toEqual(6);
  });

  it('has the correct classes for alignment and sorting', () => {
    const tableFootTestId = 'table-foot';
    const label = 'Total';
    const firstColumnTestId = `${tableFootTestId}-aggregation-${ordering[0].columnId}`;
    const thirdColumnTestId = `${tableFootTestId}-aggregation-${ordering[2].columnId}`;
    const fourthColumnTestId = `${tableFootTestId}-aggregation-${ordering[3].columnId}`;

    render(
      <table>
        <TableFoot
          testID={tableFootTestId}
          options={{
            hasRowActions: true,
            hasRowExpansion: true,
            hasRowSelection: 'multi',
          }}
          tableState={{
            aggregations: {
              label,
              columns: [
                { id: 'a', value: '300', align: 'center', isSortable: false },
                { id: 'c', value: '10', align: 'end', isSortable: true },
                { id: 'd', value: '100' },
              ],
            },
            ordering,
          }}
        />
      </table>
    );

    const aColumnTotalCell = screen.getByTestId(firstColumnTestId);
    expect(aColumnTotalCell).toHaveClass('data-table-center');
    expect(aColumnTotalCell).not.toHaveClass(`${iotPrefix}-table-foot--value__sortable`);

    const cColumnTotalCell = screen.getByTestId(thirdColumnTestId);
    expect(cColumnTotalCell).toHaveClass(
      'data-table-end',
      `${iotPrefix}-table-foot--value__sortable`
    );

    const dColumnTotalCell = screen.getByTestId(fourthColumnTestId);
    expect(dColumnTotalCell).toHaveClass('data-table-start');
  });
});
