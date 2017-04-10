import React, { Component } from 'react';
import { shape, func, string, bool } from 'prop-types';
import { observer } from 'mobx-react';
import { Route, Switch, Link } from 'react-router-dom';

import CrudExampleStore from '../demo-stores/crud-example';
import UserList from '../demo-components/user-list';
import UserDetails from '../demo-components/user-details';

import { FetchAll, FetchOne } from '../../../src/react-router';

@observer
class UserManage extends Component {
  static propTypes = {
    model: shape({
      viewModel: shape({
        name: string,
        submit: func
      })
    }).isRequired,
    store: shape({
      createItem: func
    }).isRequired,
    edit: bool
  }

  static defaultProps = {
    edit: false
  };

  changeName = ({ target }) => {
    this.props.model.viewModel.name = target.value;
  };

  addNew = () => {
    this.props.model.viewModel.submit(); // save view model
    this.props.store.createItem(this.props.model);
  }

  reset = () => this.props.model.viewModel.reset();

  render() {
    const model = this.props.model.viewModel;

    return (
      <div>
        <label htmlFor="name">
          Name: {model.name}
          <br />
          <input name="name" onChange={this.changeName} value={model.name || ''} />
        </label>
        <br />
        Is saving: {model.isSaving.get().toString()}
        <br />
        <button onClick={this.addNew}>{this.props.edit ? 'Save' : 'Add new'}</button>
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}

const CrudExample = () => (
  <div>
    <h2>CRUD example</h2>
    <Link to="/examples/crud">Home</Link>
    <Link to="/examples/crud/users">List</Link>
    <Link to="/examples/crud/users/new">Create new</Link>

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Route
        path="/examples/crud/users"
        render={() => (
          <FetchAll
            store={CrudExampleStore}
            onlyOnInit
            whenLoading={<div>list is loading</div>}
            whenFulfilled={({ data, isReloading }) => (
              <UserList users={data} isReloading={isReloading} />
            )}
            whenRejected={() => <div>error</div>}
          />
        )}
      />
      <Switch>
        <Route
          exact
          path="/examples/crud/users/new"
          render={() => (
            <UserManage
              store={CrudExampleStore}
              model={CrudExampleStore.createEmpty()}
            />
          )}
        />
        <Route
          exact
          path="/examples/crud/users/:id"
          render={({ match }) => (
            <FetchOne
              store={CrudExampleStore}
              id={match.params.id}
              whenLoading={<div>details is loading template ...</div>}
              whenFulfilled={({ data }) => <UserDetails user={data} />}
              whenRejected={() => <div>error</div>}
            />
          )}
        />
        <Route
          exact
          path="/examples/crud/users/:id/edit"
          render={({ match }) => (
            <FetchOne
              store={CrudExampleStore}
              id={match.params.id}
              whenLoading={<div>edit is loading template ...</div>}
              whenFulfilled={({ data }) => (
                <UserManage store={CrudExampleStore} model={data} edit />
              )}
              whenRejected={() => <div>error</div>}
            />
          )}
        />
      </Switch>
    </div>
  </div>
);

export default CrudExample;
