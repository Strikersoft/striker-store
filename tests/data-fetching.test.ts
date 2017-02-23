import { createDomainStore, DomainStoreConfig, DomainStore } from '../lib/index';
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
  let domainStore: DomainStore;

  beforeEach(() => {
    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    };

    domainStore = createDomainStore(config).store;
  });

  it('can fetch data list', async () => {
    await domainStore.fetchItems();

    expect(domainStore.data.size).toBeGreaterThan(0);
  });

  it('can fetch by id', async () => {
    await domainStore.fetchItemById(MockUserService.getMockModel().id);

    expect(domainStore.data.size).toBeGreaterThan(0);
  });

  it('can fetch query', async () => {
    const service = new MockUserService();
    const mock = jest.fn();
    mock
      .mockReturnValueOnce(Promise.resolve([{ id: 1, name: 'swag' }]))
      .mockReturnValueOnce(Promise.resolve([{ id: 2, name: 'swag2' }, { id: 1, name: 'swag' }]));

    service.query = mock;

    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: service,
      domainModel: MockUserModel
    };

    const domainStore = createDomainStore(config).store;
    await domainStore.queryItems({ page: 1 });

    expect(domainStore.data.size).toEqual(1);
    const model = domainStore.getItem(1);

    await domainStore.queryItems({ page: 2 });

    expect(domainStore.data.size).toEqual(2);
    expect(domainStore.getItem(1)).toBe(model);
  });

  it('remove unsynced models', async () => {
    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockCustomizedService(),
      domainModel: MockUserModel
    };

    const { store } = createDomainStore(config);

    await store.fetchItemById(MockUserService.getMockModel().id);
    await store.fetchItems();

    expect(store.getItem(MockUserService.getMockModel().id)).toBeFalsy();
  });

  it('throw backend error while fetching', async () => {
    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockUserServiceErrored(),
      domainModel: MockUserModel
    };

    const { store } = createDomainStore(config);

    try {
      await store.fetchItems();
      fail('Store not errored');
    } catch (e) {
      expect(e).toEqual(MockUserServiceErrored.getMockError());
    }
  });
});
