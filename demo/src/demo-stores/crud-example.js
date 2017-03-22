import { BaseDomainStore, ViewModel, loadingState, errorState } from '../../../src';
import { serializable, identifier } from 'serializr';
import { observable } from 'mobx';

class CRUDUserModel extends ViewModel {
  @serializable(identifier()) id;
  @serializable @observable name;

  @loadingState isLoading;
  @errorState isError;
}

class CRUDUserService {
  fetchAll() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json());
  }

  fetchOne(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => response.json())
  }
}

class CRUDStore extends BaseDomainStore {
  static service = new CRUDUserService();
  static modelSchema = CRUDUserModel;
}

export default new CRUDStore();
