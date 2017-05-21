# striker-store

[![Travis](https://travis-ci.org/Strikersoft/striker-store.svg?branch=master)][https://travis-ci.org/Strikersoft/striker-store.svg?branch=master]
[![npm package](https://img.shields.io/npm/v/striker-store.png?style=flat-square)][https://img.shields.io/npm/v/striker-store.png?style=flat-square]
[![Coverage Status](https://coveralls.io/repos/github/Strikersoft/striker-store/badge.svg?branch=master)](https://coveralls.io/github/Strikersoft/striker-store?branch=master)

> Like ember-data but for mobx and react

* * *
## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Examples & Demos](#examples--demos)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)
* * *

## Install
- This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

*tl;dr*
```
yarn add mobx mobx-react mobx-utils serializr striker-store
```

### Why all those libraries ?
striker-strore is build on mobx stack, and our peer dependencies are `mobx mobx-react mobx-utils serializr`.

## Usage
This is a library that adds somethig like `emaber-data` but for your React projects.
It also have an `react-router` v4 integration to avoid boilerplate code.

Please check out `demo` folder in source code. There is always up-to-date examples how to use library.

### Models
Model is your domain data storage.
Your model is a `class` that have at least one `@identifier` decorator. This is value will be used to track your model id.

We provide an helper base class for model called `DomainModel`. It will add a lot of lifecycle indication to your model. (isReloading, isError, isSaving, isSaved, isUpdating, isDeleting)

All this indicators are `boxed values`. To learn more: https://mobx.js.org/refguide/boxed.html


You can also define `@serializable` decorator to properties you want to serialize and deserialize.

You can also define you custom methods, for some computed values for example.

All serialization & deserialization process covered by `serializr` library from @mwestrate

More info: https://github.com/mobxjs/serializr

#### Example
```
import { serializable, identifier } from 'serializr';

class ExampleUserModel {
  @serializable(identifier()) id;
  @serializable name;
}
```

### Services
Service is communication with API.
Your service is a `class` that implements next methods:
- fetchAll
- fetchOne
- createItem
- updateItem
- deleteItem

We do not restrict that under the hood what type of transport you are use. All you need is to return an `Promise` from those methods.

#### Example
```
class ExampleUserService {
  fetchAll() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json());
  }

  fetchOne(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => response.json());
  }
}
```

### Store
You are here because of the `store`. `Store` use your `service` to fetch/update/delete/create you data. Than use you `model` to serialize/deserialize you data and store it in memory.

#### Manipulate methods
Store have following methods to manipulate with your data:
- fetchAll
- fetchOne
- createItem
- updateItem
- deleteItem

As you can see naming of the methods is equavilent of your `service` methods.
#### Store Lifecycle

##### Resolvers
It have next lifecycle (resolver) methods:
- storeDidFetchAll
- storeDidFetchOne
- storeDidCreateNew
- storeDidUpdate
- storeDidDelete

 Those methods are used to map your backend response to what we need to save in store.
 Also, it can be used to show user notifications, etc.

 By default all resolvers methods are next: `(data) => data`
 But you can override it to what you need.

 Also, this methods are `async`. So you can resolve other data.

 For example in `Post` store when you fetch post by id, you need to fetch comments.

 So you can get your comments store (with `resolveStore` or by second arg in resolved method) and fetch the comments to specific post.

##### Hooks
 In addition to those lifecycle methods there is `will` lifecycle quavilents.
 - storeWillFetchAll
 - storeWillFetchOne
 - storeWillCreateNew
 - storeWillUpdate
 - storeWillDelete

 This is pretty similar of ES6 api of React component.

 Also, we have `fail` lifecycle hooks:
- storeFetchAllFailed
- storeFetchOneFailed
- storeCreateNewFailed
- storeUpdateFailed
- storeDeleteFailed

It is useful to track errors and show notifications or manipulate models in some cases.

#### Getters

And there is a methods to get your data from store:
- has
- getMap
- getOne
- asArray (getter/computed)

#### Store name and store resolving
All stores by default registered with name same as your class name.
So class: `class MyStore {}` will be resitered as `MyStore`.

To get stores from another stores (as was described in `resolvers` serction) you should use `stores` from resolvers `did` hooks.

#### Example
Quick example:
```
import { serializable, identifier } from 'serializr';
import { BaseDomainStore } from '../../../src';

class ExampleUserModel {
  @serializable(identifier()) id;
  @serializable name;
}

class ExampleUserService {
  fetchAll() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json());
  }

  fetchOne(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => response.json());
  }
}

class ExampleUserStore extends BaseDomainStore {
  static service = new ExampleUserService();
  static modelSchema = ExampleUserModel;
}

const store new ExampleUserStore();

import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';

@observer
class QuickExample extends PureComponent {
  fetch = () => FetchingBasicStore.fetchAll();

  render() {
    return (
      <div>
        <h2>Fetching</h2>
        <div>Do initial fetch pls</div>
        <div>
          {store.asArray.map(user => <div key={user.id}> {user.name} />)}
        </div>
        <button onClick={this.fetch}>
          Fetch
        </button>
      </div>
    );
  }
}

```

### ReactRouter v4 integration
There is an helper components to use `react-router`.

#### Example
Please, check out `crud-example` in `demo` folder.

## Contribute
We are welcome to contribute. Just raise a pull request.

## License
[MIT License](LICENSE.md) © [Ostap Chervak](https://twitter.com/katsickk)
