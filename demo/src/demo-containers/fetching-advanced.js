import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import FetchingAdvanceStore from '../demo-stores/fetching-advanced';

const LoadingIndicator = observer(({ indicator }) => indicator.get() ? <span>'(Loading...)'</span> : null);
const ErrorIndicator = observer(({ indicator }) => indicator.get() ? <span>(Error occured)</span> : null);

@observer
class UserItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  onRefetch = () => {
    this.props.onRefetchOne(this.props.user.id);
  };

  render() {

    console.log(this.props.user);
    return (
      <div>
        {this.props.user.name}
        <LoadingIndicator indicator={this.props.user.isLoading} />
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

@observer
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
        <button onClick={this.fetch}>
          {FetchingAdvanceStore.didFetchedOnce ? 'Refetch all' : 'Fetch initially'}
        </button>
      </div>
    );
  }
}
