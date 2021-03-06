import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { SkipRequestHealthchecks } from '../../../actions/api/requests';

import FormModal from '../modal/FormModal';

class DisableHealthchecksModal extends Component {
  static propTypes = {
    requestId: PropTypes.string.isRequired,
    disableHealthchecks: PropTypes.func.isRequired,
    then: PropTypes.func
  };

  show() {
    this.refs.disableHealthchecksModal.show();
  }

  promptDisableHealthchecksDuration(data) {
    // TODO: this is a copy from the backbone/vex/handlebars UI, and it's
    // probably worth a UX overhaul.
    if (data.durationMillis < 3600000) {
      // if less than an hour confirm the potentially unsafe move with the user
      this.setState(data); // we need the data onConfirm of the next modal here...
      this.refs.promptDisableHealthchecksDurationModal.show();
    } else {
      // if more than an hour just go with it
      this.props.disableHealthchecks(data);
    }
  }

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <FormModal
          name="Disable Healthchecks"
          ref="disableHealthchecksModal"
          action="Disable Healthchecks"
          onConfirm={(data) => this.promptDisableHealthchecksDuration(data)}
          buttonStyle="primary"
          formElements={[
            {
              name: 'durationMillis',
              type: FormModal.INPUT_TYPES.DURATION,
              label: 'Expiration (optional)',
              help: 'If an expiration duration is specified, this action will be reverted afterwards.'
            },
            {
              name: 'message',
              type: FormModal.INPUT_TYPES.STRING,
              label: 'Message (optional)'
            }
          ]}>
          <p>Turn <strong>off</strong> healthchecks for this request.</p>
          <pre>{this.props.requestId}</pre>
        </FormModal>
        <FormModal
          ref="promptDisableHealthchecksDurationModal"
          action="Disable Healthchecks"
          onConfirm={() => this.props.disableHealthchecks(this.state)}
          buttonStyle="primary"
          formElements={[]}>
          <p><strong>Are you sure you want to disable healthchecks for less than an hour?</strong></p>
          <p>This may not be enough time for your service to get into a stable state.</p>
          <pre>{this.props.requestId}</pre>
        </FormModal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  disableHealthchecks: (data) => dispatch(SkipRequestHealthchecks.trigger(
    ownProps.requestId,
    {...data, skipHealthchecks: true}
  )).then(response => (ownProps.then && ownProps.then(response)))
});

export default connect(
  null,
  mapDispatchToProps,
  null,
  { withRef: true }
)(DisableHealthchecksModal);
