import { serializable, identifier } from 'serializr';
import { observable } from 'mobx';
import { BaseDomainStore, DomainModel } from '../../../src';

class CRUDUserModel extends DomainModel {
  @serializable(identifier()) id;
  @serializable @observable name;
}

class CRUDUserService {
  fetchAll() {
    return fetch('https://jsonplaceholder.typicode.com/users/')
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return Promise.reject(response);
      })
      .then(response => response.json());
  }

  fetchOne(id) {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return Promise.reject(response);
      })
      .then(response => response.json())
      .then(data => new Promise(resolve => setTimeout(() => resolve(data), 2000)));
  }

  createItem(model) {
    return fetch('https://jsonplaceholder.typicode.com/users', { method: 'POST', body: JSON.stringify(model) })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return Promise.reject(response);
      })
      .then(response => response.json())
      .then(data => new Promise(resolve => setTimeout(() => resolve(data), 2000)));
  }
}

class CRUDStore extends BaseDomainStore {
  static service = new CRUDUserService();
  static modelSchema = CRUDUserModel;

  storeDidCreateNew() {
    // emulate that jsonplaceholder return correct answer
    return {
      id: Math.random(),
      name: 'New created entity'
    };
  }
}

export default new CRUDStore();
