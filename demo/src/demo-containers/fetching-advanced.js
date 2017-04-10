import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';

import FetchingAdvanceStore from '../demo-stores/fetching-advanced';
import FetchButton from '../demo-components/fetch-button';
import UserList from '../demo-components/user-list';

@observer
export default class FetchingAdvancedExample extends PureComponent {
  fetch = () => FetchingAdvanceStore.fetchAll();

  render() {
    return (
      <div>
        <h2>Fetching (advanced)</h2>
        <p>
          Includes:
           loading states,
           error states,
           refetching model by id,
           custom response mapping
        </p>

        <UserList
          users={FetchingAdvanceStore.asArray}
          isLoading={FetchingAdvanceStore.isListLoading}
          withDetails={false}
          withReloading
        />
        <FetchButton onClick={this.fetch} isEmpty={FetchingAdvanceStore.isEmpty} />
      </div>
    );
  }
}
