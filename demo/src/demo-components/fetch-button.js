import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class FetchButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    isEmpty: PropTypes.shape({
      get: PropTypes.func.isRequired  // mobx boxed values: https://mobx.js.org/refguide/boxed.html
    }).isRequired
  };

  render() {
    const { onClick, isEmpty } = this.props;

    return (
      <button onClick={onClick}>
        {isEmpty.get() ? 'Fetch initially' : 'Refetch all'}
      </button>
    );
  }
}

export default FetchButton;
