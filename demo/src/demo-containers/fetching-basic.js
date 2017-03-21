import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import FetchingBasicStore from '../demo-stores/fetching-basic';

@observer
class UserItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        {this.props.user.name}
      </div>
    );
  }
}

@observer
class UserList extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        {this.props.store.asArray.map(
          (user) => <UserItem key={user.id} user={user} />
        )}
      </div>
    );
  }
}

@observer
export class FetchingBasicExample extends Component {
  onFetch = () => {
    FetchingBasicStore.fetchAll();
  };

  render() {
    return (
      <div>
        <h2>Fetching (basic)</h2>
        <UserList store={FetchingBasicStore} />
        <button onClick={this.onFetch}>
          {FetchingBasicStore.didFetchedOnce ? 'Refetch all' : 'Fetch initially'}
        </button>
      </div>
    );
  }
}
