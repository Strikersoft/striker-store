import { BaseDomainStore, ViewModel, reloadingState, errorState } from '../../../src';
import { serializable, identifier } from 'serializr';
import { observable } from 'mobx';

class CRUDUserModel extends ViewModel {
  @serializable(identifier()) id;
  @serializable @observable name;

  @reloadingState isReloading;
  @errorState isError;
}

class CRUDUserService {
  fetchAll() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then((data) => new Promise((resolve) => setTimeout(() => resolve(data), 2000)));
  }

  fetchOne(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => response.json())
      .then((data) => new Promise((resolve) => setTimeout(() => resolve(data), 2000)));
  }
}

class CRUDStore extends BaseDomainStore {
  static service = new CRUDUserService();
  static modelSchema = CRUDUserModel;
}

export default new CRUDStore();
