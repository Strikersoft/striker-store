import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Route, Switch, Link } from 'react-router-dom';
import { fromPromise } from 'mobx-utils';

import CrudExampleStore from '../demo-stores/crud-example';
import FetchButton from '../demo-components/fetch-button';
import { LoadingIndicator, ErrorIndicator } from '../demo-components/indicators';

import { FetchAll, FetchOne } from '../../../src/react-router';

@observer
class UserItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        {this.props.user.name}
        <LoadingIndicator indicator={this.props.user.isReloading} />
        <ErrorIndicator indicator={this.props.user.isError} />
        <Link to={`/examples/crud/users/${this.props.user.id}`} >Go to details</Link>
      </div>
    );
  }
}

@observer
class UserList extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired
  };

  render() {
    return (
      <div>
        {this.props.users.map(
          (user) => (
            <UserItem
              key={user.id}
              user={user}
            />
          )
        )}
       <LoadingIndicator indicator={this.props.isReloading} />
      </div>
    );
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
        <br />
        isReloading: {this.props.user.isReloading.get().toString()}
      </div>
    );
  }
}

export class CrudExample extends Component {
  render() {
    return (
      <div>
        <h2>CRUD example</h2>
        <Link to="/examples/crud">Home</Link>
        <Link to="/examples/crud/users">List</Link>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Route path="/examples/crud/users" render={({ match }) => (
            <FetchAll
              store={CrudExampleStore}
              id={match.params.id}
              onlyOnInit={true}
              whenLoading={<div>list is loading</div>}
              whenFulfilled={({ data, isReloading }) => <UserList users={data} isReloading={isReloading} />}
              whenRejected={(error) => <div>error</div>} />
            )}
          />
          <Route exact path="/examples/crud/users/:id" render={({ match }) => (
            <FetchOne
              store={CrudExampleStore}
              id={match.params.id}
              whenLoading={<div>details is loading</div>}
              whenFulfilled={({ data }) => <UserDetails user={data} />}
              whenRejected={(error) => <div>error</div>} />
            )}
          />
        </div>
      </div>
    );
  }
}
