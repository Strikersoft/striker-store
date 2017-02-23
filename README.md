# striker-store
> Battle-tested domain models managment solution for mobx-ecosystem

-   **Highly extensible:**  you can add your business logic to store;
-   **Mobx ecosystem:** under the hood we use `mobx` and `serializer` from awesome @mwestrate
-   **React ecosystem integration:** prefetch data with react-router outside `componentWillMount` hook; 
-   **XHR independent:** you can use your own favorite requests library (fetch, unfetch, axios, etc);
-   **Battle tested:** striker-store is proudly used in multiple systems at Strikersoft;

* * *
## Table of Contents

-   [Install](#install)
-   [Usage](#usage)
-   [Examples & Demos](#examples--demos)
-   [API](#api)
-   [Contribute](#contribute)
-   [License](#license)

* * *
## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save striker-store
```
Library peerDependencies are:
- [mobx](https://github.com/mobxjs/mobx)
- [mobx](https://github.com/mobxjs/serializr)

Install it with: `npm install --save mobx serializr`.

Then with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.js.org/), use as you would anything else:

```javascript
// using ES6 modules
import { createDomainStore } from 'striker-store';

// using CommonJS modules
const { createDomainStore } = require('striker-store');
```

## Usage
Example below show integration with `react`, `react-dom`, `react-router`, `mobx-react`.

**TLDR;**
Benefits:
- [Decoupled UI state](https://medium.com/@mweststrate/how-to-decouple-state-and-ui-a-k-a-you-dont-need-componentwillmount-cc90b787aa37#.wx80r2qxy)
- Easy to test

```js
// users.store.js
import { createDomainStore } from 'striker-store';
import { createSimpleModel } from 'serializr';

const api = {
  fetch() {
    // Let's emulate our backend to retrieve list of users
    return Promise.resolve([{ id: 1, name: 'White Mamba' }]);
  },
  fetchOne(id) {
    // Let's emulate our backend to retieve particular user
    return Promise.resolve({ id, name: 'White Mamba ' + id });
  }
};

const model = {
  id: true,
  name: true
};

const { store, listResolver } = createDomainStore({
  name: 'users',
  serviceToInject: api,
  domainModel: createSimpleModel(model)
});

export { store, listResolver };

// users.container.js
import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx';

class Users extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired // our store injected gently
  };

  render() {
    const { users } = this.props;

    return (
      <div>{this.props.users.list.map((user, id) => <div key={id}>{user.name}</div>)}</div>
    );
  }
}

export default inject('users')(observer(Users));

// router.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import UsersContainer from './users.container';
import { store, listResolver } from './users.store';
import { Provider } from 'mobx-react';

ReactDOM.render(
  <Provider users={store}>
    <Router history={browserHistory}>
      <Route path='/users' component={UsersContainer} onEnter={listResolver} />
    </Router>
  </Provide>,
  document.querySelector('#app')
);
```

## Examples & demos
TODO

## API
TODO

## CONTRIBUTE
TODO

## License

[MIT License](LICENSE.md) © [Ostap Chervak](https://twitter.com/chervakostap)
