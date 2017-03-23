import React, { Component } from 'react';
import { fromPromise } from 'mobx-utils';
import { observer } from 'mobx-react';

@observer
export class FetchOne extends Component {
  fromPromise;

  componentWillMount() {
    this.fromPromise = fromPromise(this.props.store.fetchOne(this.props.id));
  }

  componentWillReceiveProps(nextProps) {
    this.fromPromise = fromPromise(this.props.store.fetchOne(nextProps.id));
  }

  render() {
    if (this.props.store.has(this.props.id)) {
      const model = this.props.store.getOne(this.props.id);
      return this.props.whenFulfilled({ data: model, isReloading: model.isReloading });
    } else {
      return this.fromPromise.case({
        pending: () => this.props.whenLoading || null,
        fulfilled: (data) => this.props.whenFulfilled({ data, isReloading: data.isReloading }),
        rejected: (error) => this.props.whenRejected ? this.props.whenRejected(error) : null
      })
    }
  }
}

@observer
export class FetchAll extends Component {
  fromPromise;

  componentWillMount() {
    this.fromPromise = fromPromise(this.props.store.fetchAll());
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.onlyOnInit) {
      this.fromPromise = fromPromise(this.props.store.fetchAll());
    }
  }

  render() {
    if (this.props.store.isEmpty.get()) {
      return this.fromPromise.case({
        pending: () => this.props.whenLoading || null,
        fulfilled: (data) => this.props.whenFulfilled({ data, isReloading: this.props.store.isListLoading }),
        rejected: (error) => this.props.whenRejected ? this.props.whenRejected(error) : null
      });
    } else {
      return this.props.whenFulfilled({ data: this.props.store.asArray, isReloading: this.props.store.isListLoading });
    }
  }
}