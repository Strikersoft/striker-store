// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { shape, func, oneOfType, string, number } from 'prop-types';
import { fromPromise } from 'mobx-utils';
import { observer } from 'mobx-react';

@observer
export default class FetchOne extends Component {
  static propTypes = {
    store: shape({
      fetchOne: func
    }).isRequired,
    id: oneOfType([string, number]).isRequired,
    whenLoading: func,
    whenRejected: func,
    whenFulfilled: func.isRequired
  };

  static defaultProps = {
    whenLoading: () => null,
    whenRejected: () => null,
    whenFulfilled: () => <div>No template for whenFullfilled</div>
  };

  componentWillMount() {
    this.fromPromise = fromPromise(this.props.store.fetchOne(this.props.id));
  }

  componentWillReceiveProps(nextProps) {
    this.fromPromise = fromPromise(this.props.store.fetchOne(nextProps.id));
  }

  onSuccess = data => this.props.whenFulfilled({ data, isReloading: data.isReloading });

  onError = error => this.props.whenRejected(error);

  render() {
    if (this.props.store.has(this.props.id)) {
      const model = this.props.store.getOne(this.props.id);
      return this.props.whenFulfilled({ data: model, isReloading: model.isReloading });
    }

    return this.fromPromise.case({
      pending: this.props.whenLoading,
      fulfilled: this.onSuccess,
      rejected: this.onError
    });
  }
}
