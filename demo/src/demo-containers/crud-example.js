import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { fromPromise } from 'mobx-utils';

import CrudExampleStore from '../demo-stores/crud-example';
import FetchButton from '../demo-components/fetch-button';
import { LoadingIndicator, ErrorIndicator } from '../demo-components/indicators';

@observer
class UserItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  onRefetch = () => {
    this.props.onRefetchOne(this.props.user.id);
  };

  render() {
    return (
      <div>
        {this.props.user.name}
        <LoadingIndicator indicator={this.props.user.isLoading} />
        <ErrorIndicator indicator={this.props.user.isError} />
        <Link to={`/examples/crud/${this.props.user.id}`} >Go to details</Link>
      </div>
    );
  }
}

@observer
class UserList extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  refetchOne = (id) => this.props.store.fetchOne(id);

  render() {
    return (
      <div>
        {this.props.store.asArray.map(
          (user) => (
            <UserItem
              key={user.id}
              user={user}
              onRefetchOne={this.refetchOne}
            />
          )
        )}
      </div>
    );
  }
}

@observer
class FetchEntity extends Component {
  fromPromise;
  componentWillMount() {
    this.fromPromise = fromPromise(this.props.store.fetchOne(this.props.id));
  }

  componentWillReceiveProps() {
    this.fromPromise = fromPromise(this.props.store.fetchOne(this.props.id));
  }


  render() {
    if (this.props.store.has(this.props.id)) {
      return this.props.whenFulfilled(this.props.store.getOne(this.props.id));
    } else {
      return this.fromPromise.case({
        pending: () => this.props.whenLoading,
        fulfilled: (data) => this.props.whenFulfilled(data),
        rejected: (error) => this.props.whenRejected(error)
      })
    }
  }
}

@observer
class UserDetails extends Component {
  render() {
    return (
      <div>
        userId: {this.props.user.id}
        <br />
        userName: {this.props.user.name}
      </div>
    );
  }
}

export class CrudExample extends Component {
  fetch = () => {
    CrudExampleStore.fetchAll();
  };

  render() {
    return (
      <div>
        <h2>CRUD example</h2>
        <UserList store={CrudExampleStore} />
        <FetchButton onClick={this.fetch} isEmpty={CrudExampleStore.isEmpty} />
        <Route exact path="/examples/crud/:id" render={({ match }) => (
          <FetchEntity
            store={CrudExampleStore}
            id={match.params.id}
            whenLoading={<div>loading</div>}
            whenFulfilled={(user) => <UserDetails user={user} />}
            whenRejected={(error) => <div>error</div>} />
          )}
        />
      </div>
    );
  }
}
