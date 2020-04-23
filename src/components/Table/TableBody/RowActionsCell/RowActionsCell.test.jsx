import { mount } from 'enzyme';
import React from 'react';
import { Add32, Edit16 } from '@carbon/icons-react';

import { settings } from '../../../../constants/Settings';

import RowActionsCell from './RowActionsCell';

const { iotPrefix } = settings;
const mockApplyRowAction = jest.fn();
const commonRowActionsProps = {
  id: 'rowId',
  tableId: 'tableId',
  onApplyRowAction: mockApplyRowAction,
};

describe('RowActionsCell', () => {
  beforeEach(() => {
    mockApplyRowAction.mockClear();
  });
  test('click handler', () => {
    const actions = [{ id: 'addAction', renderIcon: Add32, iconDescription: 'See more' }];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />);
    const button = wrapper.find('.bx--btn');
    // one button should render
    expect(button).toHaveLength(1);
    button.at(0).simulate('click');
    expect(mockApplyRowAction).toHaveBeenCalledTimes(1);
  });
  test('custom SVG in button', () => {
    const actions = [
      { id: 'addAction', renderIcon: () => <svg title="my svg" />, iconDescription: 'See more' },
    ];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />);
    const button = wrapper.find('.bx--btn');
    // one button should render
    expect(button).toHaveLength(1);
    button.at(0).simulate('click');
    expect(mockApplyRowAction).toHaveBeenCalledTimes(1);
  });

  test('overflow menu trigger has ID', () => {
    const actions = [
      { id: 'add', renderIcon: Add32, iconDescription: 'See more' },
      { id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' },
    ];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />);
    const button = wrapper.find('OverflowMenu #tableId-rowId-row-actions-cell-overflow');
    // Only one id should be present
    expect(button).toHaveLength(1);
  });

  test('actions are wrapped in special gradient background container', () => {
    const action = {
      id: 'addAction',
      renderIcon: Add32,
      iconDescription: 'See more',
      labelText: 'Drill in to find out more',
    };
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={[action]} />);
    const container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background`
    );
    const button = container.find('button');

    expect(container).toHaveLength(1);
    expect(button.text()).toEqual(action.labelText);
  });

  test('action container background knows when overflow menu is open (in order to stay visible)', () => {
    const actions = [{ id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' }];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />);

    let container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(container).toHaveLength(0);

    const overflowMenu = wrapper.find('OverflowMenu');
    overflowMenu.simulate('click');
    overflowMenu.props().onOpen();
    wrapper.update();
    container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(container).toHaveLength(1);

    overflowMenu.props().onClose();
    wrapper.update();
    container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(container).toHaveLength(0);
  });
});
