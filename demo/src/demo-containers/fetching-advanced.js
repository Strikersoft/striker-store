import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import FetchingAdvanceStore from '../demo-stores/fetching-advanced';
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
        <LoadingIndicator indicator={this.props.user.isReloading} />
        <ErrorIndicator indicator={this.props.user.isError} />
        <button onClick={this.onRefetch}>Refetch {this.props.user.id}</button>
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

export class FetchingAdvancedExample extends Component {
  fetch = () => {
    FetchingAdvanceStore.fetchAll();
  };

  render() {
    return (
      <div>
        <h2>Fetching (advanced)</h2>
        <p>Includes: loading states, error states, refetching model by id, custom response mapping</p>

        <UserList store={FetchingAdvanceStore} />
        <FetchButton onClick={this.fetch} isEmpty={FetchingAdvanceStore.isEmpty} />
      </div>
    );
  }
}
