import { createDomainStore } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';
import { isObservableArray, when } from 'mobx';

describe('createDomainStore - observable data', () => {
  let domainStore;
  beforeEach(() => {
    domainStore = createDomainStore({
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    });
  });

  it('reacts on store changes', async () => {
    const { store } = domainStore;
    await store.fetchItems();

    when(() => store.data.size > 0, () => expect(store.data.size).toBeGreaterThan(0));

    await store.fetchItems();
  });
});
