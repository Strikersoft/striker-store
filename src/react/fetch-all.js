// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { shape, func, bool } from 'prop-types';
import { fromPromise } from 'mobx-utils';
import { observer } from 'mobx-react';

@observer
export default class FetchAll extends Component {
  static propTypes = {
    store: shape({
      fetchAll: func
    }).isRequired,
    // eslint-disable-next-line
    onlyOnInit: bool,
    whenLoading: func,
    whenRejected: func,
    whenFulfilled: func.isRequired
  };

  static defaultProps = {
    whenLoading: () => null,
    whenRejected: () => null,
    whenFulfilled: () => <div>No template for whenFullfilled</div>,
    onlyOnInit: false
  };

  componentWillMount() {
    this.fromPromise = fromPromise(this.props.store.fetchAll());
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.onlyOnInit) {
      this.fromPromise = fromPromise(this.props.store.fetchAll());
    }
  }

  onSuccess = data => this.props.whenFulfilled({
    data,
    isReloading: this.props.store.isListLoading
  });

  onError = error => this.props.whenRejected(error);

  render() {
    if (this.props.store.isEmpty.get()) {
      return this.fromPromise.case({
        pending: this.props.whenLoading,
        fulfilled: this.onSuccess,
        rejected: this.onError
      });
    }

    return this.props.whenFulfilled({
      data: this.props.store.asArray,
      isReloading: this.props.store.isListLoading
    });
  }
}
