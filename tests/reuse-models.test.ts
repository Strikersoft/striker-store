import { createDomainStore } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';

describe('createDomainStore - model re-usage', () => {
  let domainStore;
  beforeEach(() => {
    domainStore = createDomainStore({
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    });
  });

  it('should re-use existing model if same ID already exists', async () => {
    const { store } = domainStore;

    await store.fetchItemById(MockUserService.getMockModel().id);
    await store.fetchItemById(MockUserService.getMockModel().id);

    expect(store.getItem(1) === store.getItem(1)).toBeTruthy();
  });
});
