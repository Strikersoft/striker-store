import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
export class LoadingIndicator extends Component {
  static propTypes = {
    indicator: PropTypes.shape({
      get: PropTypes.func.isRequired  // mobx boxed values: https://mobx.js.org/refguide/boxed.html
    }).isRequired
  }
  render() {
    const { indicator } = this.props;

    if (indicator.get()) {
      return <span>(Loading...)</span>;
    }

    return null;
  }
}

@observer
export class ErrorIndicator extends Component {
  static propTypes = {
    indicator: PropTypes.shape({
      get: PropTypes.func.isRequired  // mobx boxed values: https://mobx.js.org/refguide/boxed.html
    }).isRequired
  }
  render() {
    const { indicator } = this.props;

    if (indicator.get()) {
      return <span>(ERROR)</span>;
    }

    return null;
  }
}
