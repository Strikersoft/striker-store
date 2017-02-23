import { createDomainStore } from '../lib/index';
import { MockUserModel, MockUserService, MockUserServiceErrored } from './utils';

class MockCustomizedService extends MockUserService {
  fetch() {
    return Promise.resolve([{ id: 2, name: 'hype'} ]);
  }

  fetchOne() {
    return Promise.resolve({ id: 1, name: 'hype'});
  }

}

describe('createDomainStore - fetching data', () => {
  let domainStore;
  beforeEach(() => {
    domainStore = createDomainStore({
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    });
  });

  it('can fetch data list', async () => {
    const { store } = domainStore;
    await store.fetchItems();

    expect(store.data.size).toBeGreaterThan(0);
  });

  it('can fetch by id', async () => {
    const { store } = domainStore;
    await store.fetchItemById(MockUserService.getMockModel().id);

    expect(store.data.size).toBeGreaterThan(0);
  });

  it('remove unsynced models', async () => {
    const { store } = createDomainStore({
      name: 'users',
      serviceToInject: new MockCustomizedService(),
      domainModel: MockUserModel
    });

    await store.fetchItemById(MockUserService.getMockModel().id);
    await store.fetchItems();

    expect(store.getItem(MockUserService.getMockModel().id)).toBeFalsy();
  });

  it('throw backend error while fetching', async () => {
    const { store } = createDomainStore({
      name: 'users',
      serviceToInject: new MockUserServiceErrored(),
      domainModel: MockUserModel
    });

    try {
      await store.fetchItems();
    } catch (e) {
      expect(e).toEqual(MockUserServiceErrored.getMockError());
      expect(store.data.size).toEqual(0);
    }

  });
});
