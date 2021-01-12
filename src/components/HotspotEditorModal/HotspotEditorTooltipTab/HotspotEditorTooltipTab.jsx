import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { TrashCan32, InformationFilled24 } from '@carbon/icons-react';

import Dropdown from '../../Dropdown/Dropdown';
import { TextInput } from '../../TextInput';
import { TextArea } from '../../TextArea';
import { settings } from '../../../constants/Settings';
import Button from '../../Button/Button';
import ColorDropdown from '../../ColorDropdown/ColorDropdown';
import {
  HotspotIconPropType,
  OverridePropTypes,
  ColorPropType,
} from '../../../constants/SharedPropTypes';

const { iotPrefix } = settings;

const propTypes = {
  /** Array of selectable color objects */
  hotspotIconFillColors: PropTypes.arrayOf(ColorPropType),
  /** Array of selectable icon objects. Use icon size 24 for the icon */
  hotspotIcons: PropTypes.arrayOf(HotspotIconPropType),
  /** The state values of the controlled form elements e.g. { title: 'My hotspot 1', description: 'Lorem ipsum' } */
  formValues: PropTypes.shape({
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    /** Can be an icon object or just the name if  there is a matching icon in the hotspotIcons array */
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    /** Can be a colorPropType object or just the carbonColor prop of a colorPropType object */
    color: PropTypes.oneOfType([ColorPropType, PropTypes.string]),
  }),
  /** Internationalisation strings */
  i18n: PropTypes.shape({
    deleteButtonLabelText: PropTypes.string,
    deleteButtonIconDescriptionText: PropTypes.string,
    titleInputLabelText: PropTypes.string,
    titleInputPlaceholderText: PropTypes.string,
    descriptionTextareaLabelText: PropTypes.string,
    descriptionTextareaPlaceholderText: PropTypes.string,
    iconDropdownLabelText: PropTypes.string,
    colorDropdownLabelText: PropTypes.string,
    colorDropdownTitleText: PropTypes.string,
    infoMessageText: PropTypes.string,
  }),
  translateWithId: PropTypes.func.isRequired,
  /** Callback for when any of the form element's value changes */
  onChange: PropTypes.func.isRequired,
  /** Callback for when the delete button is clicked */
  onDelete: PropTypes.func.isRequired,
  /**
   * Used to overide the internal components and props for the text based input
   * if need should arise to manage defaultValue, length or validation etc.
   */
  overrides: PropTypes.shape({
    titleTextInput: OverridePropTypes,
    decriptionTextArea: OverridePropTypes,
  }),
  /** The id of the form elememt that should be initially focused */
  primaryInputId: PropTypes.string,
  /** Show the delete hotspot button */
  showDeleteButton: PropTypes.bool,
  /** Shows the info message if true */
  showInfoMessage: PropTypes.bool,
  /** Id that can be used for testing */
  testID: PropTypes.string,
};

const defaultProps = {
  hotspotIconFillColors: undefined,
  hotspotIcons: [],
  formValues: {},
  i18n: {
    deleteButtonLabelText: 'Delete hotspot',
    deleteButtonIconDescriptionText: 'Delete this hotspot',
    titleInputLabelText: 'Title',
    titleInputPlaceholderText: 'Enter title for the tooltip',
    descriptionTextareaLabelText: 'Description',
    descriptionTextareaPlaceholderText: 'Enter description for the tooltip',
    iconDropdownLabelText: 'Select an icon',
    iconDropdownTitleText: 'Icon',
    infoMessageText:
      'Click a position on the image to add a hotspot, or set the X and Y coordinates using dataitems and create hotspots at those positions.',
    colorDropdownLabelText: 'Select a color',
    colorDropdownTitleText: 'Color',
  },
  overrides: undefined,
  primaryInputId: undefined,
  showInfoMessage: false,
  showDeleteButton: true,
  testID: 'HotspotEditorTooltipTab',
};

const preventFormSubmission = (e) => e.preventDefault();

const getSelectedColorItem = (color, hotspotIconFillColors) => {
  return typeof color === 'string' && Array.isArray(hotspotIconFillColors)
    ? hotspotIconFillColors.find((colorObj) => colorObj.carbonColor === color)
    : color;
};

const getSelectedIconItem = (icon, hotspotIcons) => {
  return typeof icon === 'string' && hotspotIcons.length
    ? hotspotIcons.find((iconObj) => iconObj.id === icon)
    : icon;
};

const HotspotEditorTooltipTab = ({
  hotspotIcons,
  hotspotIconFillColors,
  formValues,
  i18n,
  primaryInputId,
  onChange,
  onDelete,
  overrides,
  showInfoMessage,
  showDeleteButton,
  testID,
  translateWithId,
}) => {
  const {
    deleteButtonLabelText,
    deleteButtonIconDescriptionText,
    titleInputLabelText,
    titleInputPlaceholderText,
    descriptionTextareaLabelText,
    descriptionTextareaPlaceholderText,
    iconDropdownLabelText,
    iconDropdownTitleText,
    infoMessageText,
    colorDropdownLabelText,
    colorDropdownTitleText,
  } = merge({}, defaultProps.i18n, i18n);

  const currentIconColor =
    formValues.color?.carbonColor ?? formValues.color ?? 'currentcolor';

  const renderInfoMessage = () => (
    <div className={`${iotPrefix}--hotspot-editor--tooltip-info-message`}>
      <InformationFilled24 />
      <p>{infoMessageText}</p>
    </div>
  );

  const renderColorIconContainer = () => (
    <div
      className={`${iotPrefix}--icon-color-container`}
      style={{ '--icon-fill-color': currentIconColor }}>
      <Dropdown
        key={formValues.icon?.id ?? formValues.icon}
        id="tooltip-form-icon"
        items={hotspotIcons}
        label={iconDropdownLabelText}
        light
        onChange={(change) => {
          onChange({ icon: change.selectedItem.id });
        }}
        selectedItem={getSelectedIconItem(formValues?.icon, hotspotIcons)}
        titleText={iconDropdownTitleText}
        type="default"
        translateWithId={translateWithId}
      />

      <ColorDropdown
        key={currentIconColor} // Neded to update the selectedColor after initial render
        selectedColor={getSelectedColorItem(
          formValues.color,
          hotspotIconFillColors
        )}
        id="tooltip-form-color"
        colors={hotspotIconFillColors}
        label={colorDropdownLabelText}
        light
        onChange={(selectedColorItem) => {
          onChange({ color: selectedColorItem.color?.carbonColor });
        }}
        titleText={colorDropdownTitleText}
        translateWithId={translateWithId}
      />
    </div>
  );

  const MyTitleTextInput = overrides?.titleTextInput?.component || TextInput;
  const MyDecriptionTextArea =
    overrides?.decriptionTextArea?.component || TextArea;

  return (
    <div className={`${iotPrefix}--hotspot-editor-tooltip-tab`}>
      {showInfoMessage ? (
        renderInfoMessage()
      ) : (
        <>
          <form
            className={`${iotPrefix}--hotspot-editor--tooltip-form`}
            data-testid={testID}
            onSubmit={preventFormSubmission}>
            <MyTitleTextInput
              name="title"
              data-testid={`${testID}-title-input`}
              value={formValues.content?.title || ''}
              id={primaryInputId || 'tooltip-form-title'}
              labelText={titleInputLabelText}
              light
              onChange={(evt) => {
                onChange({ content: { title: evt.target.value } });
              }}
              placeholder={titleInputPlaceholderText}
              type="text"
              {...overrides?.titleTextInput?.props}
            />
            <MyDecriptionTextArea
              name="description"
              id="tooltip-form-description"
              labelText={descriptionTextareaLabelText}
              light
              onChange={(evt) => {
                onChange({ content: { description: evt.target.value } });
              }}
              placeholder={descriptionTextareaPlaceholderText}
              value={formValues.content?.description || ''}
              {...overrides?.decriptionTextArea?.props}
            />
            {renderColorIconContainer()}
          </form>
          {showDeleteButton ? (
            <div
              className={`${iotPrefix}--hotspot-editor-tooltip-tab__delete-button-container`}>
              <Button
                kind="ghost"
                renderIcon={TrashCan32}
                iconDescription={deleteButtonIconDescriptionText}
                onClick={onDelete}>
                {deleteButtonLabelText}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

HotspotEditorTooltipTab.propTypes = propTypes;
HotspotEditorTooltipTab.defaultProps = defaultProps;

export default HotspotEditorTooltipTab;
