import { BaseDomainStore } from '../../../src';
import { serializable, identifier } from 'serializr';

const users = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' }
];

const user = {
  id: 3,
  name: 'User 3'
}

class ExampleUserModel {
  @serializable(identifier()) id;
  @serializable name;
}

class ExampleUserService {
  fetchAll() {
    // Mock users endpoint
    return Promise.resolve(users);
  }

  fetchOne() {
    // Mock user endpoint
    return Promise.resolve(user);
  }
}

class ExampleUserStore extends BaseDomainStore {
  static service = new ExampleUserService();
  static modelSchema = ExampleUserModel;
}

export default new ExampleUserStore();
