import { BaseDomainStore } from '../../../src';
import { serializable, identifier } from 'serializr';

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

export default new ExampleUserStore();
