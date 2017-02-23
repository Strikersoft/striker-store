import { createDomainStore, DomainService, DomainStoreConfig } from '../lib/index';
import { serializable, createSimpleSchema, identifier } from 'serializr';

export class MockUserService implements DomainService {
  fetch() {
    return Promise.resolve([MockUserService.getMockModel()]);
  }

  fetchOne() {
    return Promise.resolve(MockUserService.getMockModel());
  }

  query() {
    return Promise.resolve([MockUserService.getMockModel()]);
  }

  static getMockModel() {
    return { id: 1, name: 'swag'};
  }
}

export class MockUserServiceErrored implements DomainService {
  fetch() {
    return Promise.reject(MockUserServiceErrored.getMockError());
  }

  fetchOne() {
    return Promise.reject(MockUserServiceErrored.getMockError());
  }

  query() {
    return Promise.resolve([MockUserService.getMockModel()]);
  }

  static getMockError() {
    return { error: 'error' };
  }
}

export class MockUserModel {
  @serializable(identifier()) id;
  @serializable name = '';
}
