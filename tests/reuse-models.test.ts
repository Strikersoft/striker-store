import { createDomainStore, DomainStoreConfig, DomainStore } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';

describe('createDomainStore - model re-usage', () => {
  let domainStore: DomainStore;

  beforeEach(() => {
    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    };

    domainStore = createDomainStore(config).store;
  });

  it('should re-use existing model if same ID already exists', async () => {

    await domainStore.fetchItemById(MockUserService.getMockModel().id);
    await domainStore.fetchItemById(MockUserService.getMockModel().id);

    expect(domainStore.getItem(1) === domainStore.getItem(1)).toBeTruthy();
  });
});
