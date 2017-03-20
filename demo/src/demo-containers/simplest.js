import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import SimpleStoreDemo from '../demo-stores/simplest';

@observer
class UserItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    return <div>{this.props.user.name}</div>
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
        {this.props.store.asArray.map(user => <UserItem key={user.id} user={user} />)}
      </div>
    )
  }
}

export class SimplestDemo extends Component {
  componentDidMount() {
    SimpleStoreDemo.fetchAll();
  }

  onRefetch = () => {
    SimpleStoreDemo.fetchAll();
  };

  render() {
    return (
      <div>
        <h2>Fetching All Demo</h2>
        <UserList store={SimpleStoreDemo} />
        <button onClick={this.onRefetch}>
          Refetch
        </button>
      </div>
    );
  }
}
