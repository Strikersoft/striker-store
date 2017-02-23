import { createDomainStore, DomainStoreConfig, DomainStore, DomainService } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';
import { isObservableArray, when } from 'mobx';
import { createSimpleSchema } from 'serializr';

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

  it('set modelKey from config', async () => {
    class Service implements DomainService {
      fetch() {
        return Promise.resolve([{ _id: 1, name: 'swag' }]);
      }

      fetchOne() {
        return Promise.resolve();
      }

      query() {
        return Promise.resolve();
      }
    }

    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new Service(),
      domainModel: createSimpleSchema({ _id: true, name: true }),
      modelKey: '_id'
    };
    const domainStore = createDomainStore(config).store;

    await domainStore.fetchItems();

    expect(domainStore.getItem(1)).toEqual({ _id: 1, name: 'swag' });
  });
});
