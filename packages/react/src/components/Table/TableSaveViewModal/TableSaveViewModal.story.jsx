import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { AccordionItem, Accordion } from 'carbon-components-react';

import { TextArea } from '../../TextArea';

import TableSaveViewModal from './TableSaveViewModal';

export default {
  title: __DEV__ ? 'Watson IoT/⚠️ Table/TableSaveViewModal' : 'Watson IoT/Table/TableSaveViewModal',

  parameters: {
    component: TableSaveViewModal,
  },
};

export const DefaultWithKnobs = () => {
  return (
    <TableSaveViewModal
      actions={{
        onSave: action('onSave'),
        onClose: action('onClose'),
        onClearError: action('onClearError'),
        onChange: action('onChange'),
      }}
      sendingData={boolean('sendingData', false)}
      error={select('error', [undefined, 'My error msg'], undefined)}
      open={boolean('open', true)}
      titleInputInvalid={boolean('titleInputInvalid', false)}
      titleInputInvalidText={text('titleInputInvalidText', undefined)}
      viewDescription={text('viewDescription', 'Entities: 2 filters, Alerts: 3 filters')}
    />
  );
};

DefaultWithKnobs.story = {
  name: 'Default with knobs',

  parameters: {
    info: {
      text: `
        This TableSaveViewModal story demonstrates the most common usage, including actions
        and validation via the knobs.`,
      propTables: [TableSaveViewModal],
    },
  },
};

export const Prefilled = () => {
  return (
    <TableSaveViewModal
      actions={{
        onSave: action('onSave'),
        onClose: action('onClose'),
        onClearError: action('onClearError'),
        onChange: action('onChange'),
      }}
      open
      initialFormValues={{
        title: 'My view 1',
        isDefault: true,
      }}
    />
  );
};

Prefilled.story = {
  parameters: {
    info: {
      text: `
    This story demonstrates how to set the initial default values of the form by using the initialFormValues.
    By default the modal contains the following values {title: '', isDefault: false, isPublic: false }`,
    },
  },
};

export const CustomDescriptionAndPublicCheckboxUsingOverrides = () => {
  /**
   * This story demonstrates how to customise parts of the TableSaveViewModal internals,
   * i.e. the description and the publicCheckbox.
   *
   * We use the overrides pattern to go two levels deep in our customization.
   */

  const descriptionContent = (
    <Fragment>
      <AccordionItem title="4 active filters">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </AccordionItem>
      <AccordionItem title="1 hidden column">
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
      </AccordionItem>
    </Fragment>
  );

  return (
    <TableSaveViewModal
      open
      actions={{
        onSave: action('onSave'),
        onClose: action('onClose'),
        onClearError: action('onClearError'),
        onChange: action('onChange'),
      }}
      overrides={{
        // We use the overrides property tableSaveViewForm to get access to that internal component
        tableSaveViewForm: {
          props: {
            // In the tableSaveViewForm we use props and overrides again to get access to its internals
            overrides: {
              // The internal component called viewDescriptionContainer is changed from a <p> to
              // an Accordion component and the children prop is overridden and served AccordionItems
              // instead of a normal string.
              viewDescriptionContainer: {
                component: Accordion,
                props: { children: descriptionContent },
              },
              // The public checkbox is overridden with the prop 'disabled' that forces
              // it to always stay disabled, no matter the status of the form or modal.
              publicCheckbox: { props: { disabled: true } },
            },
          },
        },
      }}
    />
  );
};

CustomDescriptionAndPublicCheckboxUsingOverrides.story = {
  name: 'Custom description and public checkbox (using overrides)',

  parameters: {
    info: {
      text: `
      This story demonstrates how to customise parts of the TableSaveViewModal internals,
      i.e. the description and the publicCheckbox.

      We use the overrides pattern to go two levels deep in our customization.

      ~~~js
      // Overrides example
      <TableSaveViewModal overrides={{
        // We use the overrides property tableSaveViewForm to get access to that internal component
        tableSaveViewForm: {
          props: {
            // In the tableSaveViewForm we use props and overrides again to get access to its internals
            overrides: {
              // The internal component called viewDescriptionContainer is changed from a <p> to
              // an Accordion component and the children prop is overridden and served AccordionItems
              // instead of a normal string.
              viewDescriptionContainer: {
                component: Accordion,
                props: { children: (
                  <Fragment>
                  <AccordionItem title="4 active filters">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </p>
                  </AccordionItem>
                  <AccordionItem title="1 hidden column">
                    <p>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                      ea commodo consequat.
                    </p>
                  </AccordionItem>
                </Fragment>
                ) },
              },
              // The public checkbox is overridden with the prop 'disabled' that forces
              // it to always stay disabled, no matter the status of the form or modal.
              publicCheckbox: { props: { disabled: true } },
            },
          },
        },
      }} />
      ~~~
      `,
      propTables: [TableSaveViewModal],
    },
  },
};

export const CustomFormUsingOverrides = () => {
  /**
   *  This story demonstrates how to change the complete form of the modal using the overrides pattern.
   */
  const myPrimaryInputId = 'myTextArea';

  return (
    <TableSaveViewModal
      open
      actions={{
        onSave: action('onSave'),
        onClose: action('onClose'),
        onClearError: action('onClearError'),
        onChange: action('onChange'),
      }}
      initialFormValues={{
        myTextArea: 'I can also have an initial value',
      }}
      i18n={{
        ...TableSaveViewModal.defaultProps.i18n,
        modalBodyText: 'You can save whatever you want',
      }}
      overrides={{
        // We use the overrides property composedModal to get access to that internal component
        composedModal: {
          props: {
            // We override the selectorPrimaryFocus prop to use the ID of our new primary input
            selectorPrimaryFocus: `#${myPrimaryInputId}`,
            // We also override the footer to remove the isPrimaryButtonDisabled that was dependent
            // on the old title not being empty. For simplicity here we always keep it enabled.
            footer: { isPrimaryButtonDisabled: false },
          },
        },
        tableSaveViewForm: {
          // Here we completely override the TableSaveViewForm component with a custom one.
          // The two most important props that we need to wire up is the onChange and disabled.
          component: ({ onChange, disabled }) => {
            return (
              <form>
                <TextArea
                  disabled={disabled}
                  labelText="My custom form element"
                  // ID is needed to make this element focused by default
                  id={myPrimaryInputId}
                  onChange={(evt) => {
                    // We need to emit the name and the value of our changed form element so that
                    // the parent (TableSaveViewModal) can manage the state for us.
                    onChange({ myTextArea: evt.target.value });
                  }}
                />
              </form>
            );
          },
        },
      }}
    />
  );
};

CustomFormUsingOverrides.story = {
  name: 'Custom form (using overrides)',

  parameters: {
    info: {
      text: `
    This story demonstrates how to change the complete form of the modal using the overrides pattern.
    The overrides section of the code is examplified below.

    ~~~js
    <TableSaveViewModal overrides={{
      composedModal: {
        // We use the overrides property composedModal to get access to that internal component
        props: {
          // We override the selectorPrimaryFocus prop to use the ID of our new primary input
          selectorPrimaryFocus: 'myTextArea'},
          // We also override the footer to remove the isPrimaryButtonDisabled that was dependent
          // on the old title not being empty. For simplicity here we always keep it enabled.
        footer: { isPrimaryButtonDisabled: false },
        },
      },
      tableSaveViewForm: {
        // Here we completely override the tableSaveViewForm component with our own one.
        // The two most important props that we need to wire up is the onChange and disabled.
        component: ({ onChange, disabled }) => {
          return (
            <form>
              <TextArea
                disabled={disabled}
                labelText="My custom form element"
                // ID is needed to make this element focused by default
                id="myTextArea"
                onChange={evt => {
                  // We need to emit the name and the value of our changed form element so that
                  // the parent (TableSaveViewModal) can manage the state for us.
                  onChange({ myTextArea: evt.target.value });
                }}
              />
            </form>
          );
        },
      },
    }}
  />
    ~~~
    `,
      propTables: [TableSaveViewModal],
    },
  },
};
