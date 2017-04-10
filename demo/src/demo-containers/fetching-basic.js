import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';

import FetchingBasicStore from '../demo-stores/fetching-basic';
import FetchButton from '../demo-components/fetch-button';
import UserList from '../demo-components/user-list';

@observer
export default class FetchingBasicExample extends PureComponent {
  fetch = () => FetchingBasicStore.fetchAll();

  render() {
    return (
      <div>
        <h2>Fetching (basic)</h2>
        <div>Do initial fetch pls</div>
        <UserList
          users={FetchingBasicStore.asArray}
          isLoading={FetchingBasicStore.isListLoading}
          withDetails={false}
        />
        <FetchButton onClick={this.fetch} isEmpty={FetchingBasicStore.isEmpty} />
      </div>
    );
  }
}
