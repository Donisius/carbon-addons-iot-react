import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Close20 } from '@carbon/icons-react';

import PageTitleBar from '../../PageTitleBar/PageTitleBar';
import Button from '../../Button/Button';
import ProgressIndicator from '../../ProgressIndicator/ProgressIndicator';
import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string,
    description: PropTypes.string,
    blurb: PropTypes.string,
    onClose: PropTypes.func,
    closeButtonTitle: PropTypes.string,
    currentItemId: PropTypes.string.isRequired,
    setItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        component: PropTypes.element.isRequired,
      })
    ).isRequired,
    showLabels: PropTypes.bool,
    stepWidth: PropTypes.number,
    isClickable: PropTypes.bool,
  };

  static defaultProps = {
    title: null,
    blurb: null,
    description: null,
    showLabels: true,
    stepWidth: 136,
    onClose: null,
    closeButtonTitle: 'Close',
    isClickable: false,
  };

  state = {};

  render = () => {
    const {
      currentItemId,
      setItem,
      items,
      showLabels,
      stepWidth,
      title,
      blurb,
      description,
      onClose,
      closeButtonTitle,
      isClickable,
    } = this.props;

    const closeButton = (
      <Button className="bx--modal-close" title={closeButtonTitle} type="button">
        <Close20 onClick={onClose} />
      </Button>
    );

    return (
      <Fragment>
        <PageTitleBar
          className={`${iotPrefix}--wizard-inline__header`}
          title={title}
          description={blurb || description}
          extraContent={onClose ? closeButton : null}
        />
        <ProgressIndicator
          className={`${iotPrefix}--wizard-inline__progress-indicator`}
          currentItemId={currentItemId}
          items={items.map((item) => ({ id: item.id, label: item.name }))}
          showLabels={showLabels}
          onClickItem={setItem}
          stepWidth={stepWidth}
          isClickable={isClickable}
        />
      </Fragment>
    );
  };
}

export default WizardHeader;
