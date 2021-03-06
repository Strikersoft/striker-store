import { serializable, identifier } from 'serializr';
import { BaseDomainStore, DomainModel } from '../../../src';

class ExampleAdvancedUserModel extends DomainModel {
  @serializable(identifier()) id;
  @serializable name;
}

class ExampleUserService {
  fetchAll() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json());
  }

  fetchOne(id) {
    // Emulate failure from backend
    if (this.emulateFail) {
      this.emulateFail = false;
      return Promise.reject('ERROR FETCH ONE');
    }
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => {
        this.emulateFail = true;
        return response.json();
      });
  }
}

class ExampleAdvancedUserStore extends BaseDomainStore {
  static service = new ExampleUserService();
  static modelSchema = ExampleAdvancedUserModel;

  storeDidFetchAll({ response }) {
    // Emulate not standard response
    const customResponse = { data: response };
    return customResponse.data;
  }

  storeDidFetchOne({ response }) {
    // Emulate not standard response
    const customResponse = { data: response };
    return customResponse.data;
  }

  storeFetchAllFailed(error) {
    console.warn('My custom fetch all global error handler', error);
  }

  storeFetchOneFailed(error) {
    console.warn('My custom fetch one global error handler', error);
  }
}

export default new ExampleAdvancedUserStore();
