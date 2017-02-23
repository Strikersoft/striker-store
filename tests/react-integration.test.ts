import { createDomainStore, DomainStoreConfig, DomainStore } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';
import { isObservableArray, when } from 'mobx';

describe('createDomainStore - observable data', () => {
  let domainStore: DomainStore;

  beforeEach(() => {
    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    };

    domainStore = createDomainStore(config).store;
  });

  it('reacts on store changes', async (done) => {
    await domainStore.fetchItems();

    when(() => domainStore.data.size > 0, () => {
      expect(domainStore.data.size).toBeGreaterThan(0);
      done();
    });

    await domainStore.fetchItems();
  });
});
