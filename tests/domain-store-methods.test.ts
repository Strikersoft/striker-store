import { createDomainStore, DomainStoreConfig, DomainStore } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';
import { isObservableArray, when } from 'mobx';

describe('DomainStore - public methods', () => {
  let domainStore: DomainStore;

  beforeEach(() => {
    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    };
    domainStore = createDomainStore(config).store;
  });

  it('getItem should return particular model by id', async () => {
    await domainStore.fetchItems();

    expect(domainStore.getItem(MockUserService.getMockModel().id)).toEqual(MockUserService.getMockModel());
  });
});
