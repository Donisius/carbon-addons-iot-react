import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { SettingsAdjust16 as SettingsAdjust } from '@carbon/icons-react';

import Button from '../Button/Button';
import { Tooltip } from '../Tooltip';
import { settings } from '../../constants/Settings';
import { usePopoverPositioning } from '../../hooks/usePopoverPositioning';

const { iotPrefix } = settings;

export const FlyoutMenuDirection = {
  BottomStart: 'bottom-start',
  BottomEnd: 'bottom-end',
  TopStart: 'top-start',
  TopEnd: 'top-end',
  LeftStart: 'left-start',
  LeftEnd: 'left-end',
  RightStart: 'right-start',
  RightEnd: 'right-end',
};

const getTooltipDirection = (direction) => {
  switch (direction) {
    case FlyoutMenuDirection.TopStart:
    case FlyoutMenuDirection.TopEnd:
      return 'top';
    case FlyoutMenuDirection.RightStart:
    case FlyoutMenuDirection.RightEnd:
      return 'right';
    case FlyoutMenuDirection.LeftStart:
    case FlyoutMenuDirection.LeftEnd:
      return 'left';
    default:
      return 'bottom';
  }
};

// No need to do prop checks since these are alredy done in flyout
// eslint-disable-next-line  react/prop-types
const DefaultFooter = ({ setIsOpen, onCancel, onApply, i18n }) => (
  <>
    <Button
      className={`${iotPrefix}--flyout-menu__cancel`}
      kind="secondary"
      testID="flyout-menu-cancel"
      onClick={() => {
        setIsOpen(false);

        if (onCancel) {
          onCancel();
        }
      }}
      aria-label={i18n.cancelButtonText}
    >
      {i18n.cancelButtonText}
    </Button>
    <Button
      className={`${iotPrefix}--flyout-menu__submit`}
      aria-label={i18n.applyButtonText}
      testID="flyout-menu-apply"
      onClick={() => {
        setIsOpen(false);
        if (onApply) {
          onApply();
        }
      }}
    >
      {i18n.applyButtonText}
    </Button>
  </>
);

const FlyoutMenu = ({
  buttonProps,
  buttonSize,
  direction,
  menuOffset,
  defaultOpen,
  iconDescription,
  children,
  disabled,
  i18n,
  light,
  renderIcon,
  testId,
  tooltipId,
  triggerId,
  tabIndex,
  tooltipClassName,
  passive,
  hideTooltip,
  customFooter: CustomFooter,
  onApply,
  onCancel,
  useAutoPositioning,
  onChange,
  isOpen,
}) => {
  const [isControlledOpen, setIsOpen] = useState(defaultOpen);
  const [tooltipDirection, setTooltipDirection] = useState(getTooltipDirection(direction));
  const buttonRef = useRef(null);

  const getFlyoutMenuOffset = React.useCallback(
    (tooltipElement, flyoutDirection, tooltipButtonElement, flipped) => {
      let topOffset = 0;
      let leftOffset = 0;

      const caretWidth = 16;
      const caretHeight = 14;
      const borderWidth = 1;

      const tooltipContent = tooltipElement.querySelector('[role="dialog"]');
      const tooltipWidth = tooltipContent ? tooltipContent.getBoundingClientRect().width : 0;
      const tooltipHeight = tooltipContent ? tooltipContent.getBoundingClientRect().height : 0;
      const buttonWidth = buttonRef.current ? buttonRef.current.getBoundingClientRect().width : 0;

      let rtlOffset = buttonWidth;

      switch (flyoutDirection) {
        case FlyoutMenuDirection.LeftStart:
          topOffset = tooltipHeight / 2 + caretHeight - borderWidth;
          rtlOffset = 0;
          break;

        // off
        case FlyoutMenuDirection.LeftEnd:
          topOffset =
            -tooltipHeight / 2 + caretHeight + caretWidth - borderWidth - (48 - buttonWidth);
          rtlOffset = 0;
          break;
        case FlyoutMenuDirection.RightStart:
          topOffset = tooltipHeight / 2 + borderWidth;
          rtlOffset = -rtlOffset;
          break;

        // off
        case FlyoutMenuDirection.RightEnd:
          topOffset = caretWidth - tooltipHeight / 2 + borderWidth - (48 - buttonWidth);
          rtlOffset = -rtlOffset;
          break;
        case FlyoutMenuDirection.TopStart:
          leftOffset = caretWidth + tooltipWidth / 2;
          topOffset = caretHeight;
          break;
        case FlyoutMenuDirection.TopEnd:
          leftOffset = -tooltipWidth / 2 - caretWidth + buttonWidth;
          topOffset = caretHeight;
          break;
        case FlyoutMenuDirection.BottomEnd:
          topOffset = -caretHeight;
          leftOffset = -tooltipWidth / 2 - caretWidth + buttonWidth;
          break;
        default:
          // Bottom Start
          leftOffset = caretWidth + tooltipWidth / 2;
          topOffset = -caretHeight;
      }

      if (document.dir === 'rtl') {
        leftOffset -= rtlOffset;
      }

      let propTop = 0;
      let propLeft = 0;

      if (typeof menuOffset === 'function') {
        const { top, left } = menuOffset(
          tooltipElement,
          flyoutDirection,
          tooltipButtonElement,
          flipped
        );

        propTop = top;
        propLeft = left;
      } else if (
        typeof menuOffset === 'object' &&
        (menuOffset.hasOwnProperty('top') || menuOffset.hasOwnProperty('left'))
      ) {
        const { top = 0, left = 0 } = menuOffset;

        propTop = top;
        propLeft = left;
      }

      return {
        top: topOffset + propTop,
        left: leftOffset + propLeft,
      };
    },
    [menuOffset]
  );

  const [calculateMenuOffset, { adjustedDirection }] = usePopoverPositioning({
    direction,
    menuOffset: getFlyoutMenuOffset,
    useAutoPositioning,
  });

  useEffect(() => {
    setTooltipDirection(getTooltipDirection(adjustedDirection));
  }, [adjustedDirection]);

  const Footer = CustomFooter ? (
    <CustomFooter setIsOpen={setIsOpen} isOpen={isControlledOpen} />
  ) : (
    <DefaultFooter setIsOpen={setIsOpen} onCancel={onCancel} onApply={onApply} i18n={i18n} />
  );

  return (
    <div
      style={{
        '--tooltip-visibility': hideTooltip ? 'hidden' : 'visible',
      }}
      ref={buttonRef}
      className={classnames(
        [`${iotPrefix}--flyout-menu`],
        `${iotPrefix}--flyout-menu__${tooltipDirection}`,
        {
          [`${iotPrefix}--flyout-menu__light`]: light,
          [`${iotPrefix}--flyout-menu__open`]: isControlledOpen,
        }
      )}
    >
      <Button
        {...buttonProps}
        aria-label={iconDescription}
        iconDescription={iconDescription}
        className={classnames(`${iotPrefix}--flyout-menu--trigger-button`, buttonProps?.className)}
        disabled={disabled}
        hasIconOnly
        kind="ghost"
        testID={`${testId}-button`}
        size={buttonSize}
        renderIcon={renderIcon}
        onClick={() => {
          if (typeof buttonProps.onClick === 'function') {
            buttonProps.onClick();
          }
          setIsOpen(!isControlledOpen);
        }}
      />
      {
        <div className={`${iotPrefix}--flyout-menu--tooltip-anchor`} data-floating-menu-container>
          <Tooltip
            disabled={disabled}
            className={classnames(
              tooltipClassName,
              `${iotPrefix}--flyout-menu--body`,
              `${iotPrefix}--flyout-menu--body__${adjustedDirection}`,
              {
                [`${iotPrefix}--flyout-menu--body__light`]: light,
                [`${iotPrefix}--flyout-menu--body__open`]:
                  typeof isOpen === 'boolean' ? isOpen : isControlledOpen,
                [`${iotPrefix}--flyout-menu--body__${buttonSize}`]: buttonSize !== 'default',
              }
            )}
            iconDescription={iconDescription}
            data-testid={testId}
            showIcon={false}
            open={typeof isOpen === 'boolean' ? isOpen : isControlledOpen}
            direction={tooltipDirection}
            menuOffset={calculateMenuOffset}
            tooltipId={tooltipId}
            id={tooltipId} // https://github.com/carbon-design-system/carbon/pull/6744
            triggerId={triggerId}
            tabIndex={tabIndex}
            useAutoPositioning={false}
            onChange={onChange}
          >
            <div>
              {children}

              {!passive && (
                <div className={`${iotPrefix}--flyout-menu__bottom-container`}>{Footer}</div>
              )}
            </div>
          </Tooltip>
        </div>
      }
    </div>
  );
};

const propTypes = {
  tooltipId: PropTypes.string,

  /**
   * The ID of the trigger button.
   */
  triggerId: PropTypes.string,

  /**
   * Optional starting value for uncontrolled state
   */
  defaultOpen: PropTypes.bool,

  /**
   * Contents to put into the flyout menu.
   */
  children: PropTypes.node,

  /**
   * The CSS class names of the flyout menu.
   */
  tooltipClassName: PropTypes.string,

  /**
   * Where to put the flyout menu, relative to the trigger UI.
   */
  direction: PropTypes.oneOf([
    FlyoutMenuDirection.BottomStart,
    FlyoutMenuDirection.BottomEnd,
    FlyoutMenuDirection.TopStart,
    FlyoutMenuDirection.TopEnd,
    FlyoutMenuDirection.LeftStart,
    FlyoutMenuDirection.LeftEnd,
    FlyoutMenuDirection.RightStart,
    FlyoutMenuDirection.RightEnd,
  ]),

  /**
   * The adjustment of the flyout position.
   */
  menuOffset: PropTypes.oneOfType([
    PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
    }),
    PropTypes.func,
  ]),

  /**
   * The description of the default flyout icon
   */
  iconDescription: PropTypes.string.isRequired,

  /**
   * Optional prop to specify the tabIndex of the Tooltip
   */
  tabIndex: PropTypes.number,

  /**
   * Optional prop to specify the test id of the flyout
   */
  testId: PropTypes.string,

  /**
   * Will not render a footer
   */
  passive: PropTypes.bool,

  /**
   * Whether to show the iconDescription tooltip on the trigger button
   */
  hideTooltip: PropTypes.bool,

  /**
   * Content to be rendered in place of the normal footer (ie. MyComponent).
   */
  customFooter: PropTypes.elementType,

  /**
   * On Cancel button callback
   */
  onCancel: PropTypes.func,

  /**
   * On Apply button callback
   */
  onApply: PropTypes.func,

  /** Set of internationalized button names */
  i18n: PropTypes.shape({
    cancelButton: PropTypes.string,
    applyButton: PropTypes.string,
  }),

  /**
   * Define the icon render to be rendered.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   *  Disable the button and tooltip
   */
  disabled: PropTypes.bool,

  buttonSize: PropTypes.string,

  light: PropTypes.bool,

  useAutoPositioning: PropTypes.bool,
  onChange: PropTypes.func,

  /** classes that can be passed to the button used for the flyout menu */
  buttonProps: PropTypes.shape({
    className: PropTypes.string,
  }),

  isOpen: PropTypes.bool,
};

const defaultProps = {
  buttonProps: {},
  renderIcon: SettingsAdjust,
  buttonSize: 'default',
  tooltipId: 'flyout-tooltip',
  triggerId: 'flyout-trigger-id',
  defaultOpen: false,
  children: undefined,
  tooltipClassName: '',
  passive: false,
  hideTooltip: true,
  customFooter: null,
  tabIndex: 0,
  testId: 'flyout-menu',
  direction: FlyoutMenuDirection.BottomStart,
  menuOffset: {
    top: 0,
    left: 0,
  },
  i18n: {
    cancelButtonText: 'Cancel',
    applyButtonText: 'Apply',
  },
  isOpen: null,
  onCancel: null,
  onApply: null,
  disabled: false,
  light: true,
  useAutoPositioning: false,
  onChange: () => {},
};

FlyoutMenu.propTypes = propTypes;
FlyoutMenu.defaultProps = defaultProps;

export default FlyoutMenu;
