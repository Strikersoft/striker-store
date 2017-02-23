import { createDomainStore, DomainStoreConfig, DomainService, DomainStore } from '../lib/index';
import { MockUserModel, MockUserService, MockUserServiceErrored } from './utils';

class MockCustomizedService implements DomainService {
  fetch() {
    return Promise.resolve({
      data: [{ id: 2, name: 'hype'} ]
    });
  }

  fetchOne() {
    return Promise.resolve({ id: 1, name: 'hype' });
  }

  query() {
    return Promise.resolve([MockUserService.getMockModel()]);
  }

}

describe('createDomainStore - selectors hooks', () => {
  it('triggers listSelector', async () => {
    const listSelectorMock = jest.fn(() => ([]));

    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockCustomizedService(),
      domainModel: MockUserModel,
      selectors: {
        listSelector: listSelectorMock
      }
    };

    const domainStore = createDomainStore(config).store;

    await domainStore.fetchItems();

    expect(listSelectorMock).toBeCalled();
  });

  it('triggers itemSelector', async () => {
    const itemSelectorMock = jest.fn(() => ({ id: 1 }));

    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockCustomizedService(),
      domainModel: MockUserModel,
      selectors: {
        itemSelector: itemSelectorMock,
        listSelector: () => ([])
      }
    };

    const domainStore = createDomainStore(config).store;

    await domainStore.fetchItemById();

    expect(itemSelectorMock).toBeCalled();
  });
});
