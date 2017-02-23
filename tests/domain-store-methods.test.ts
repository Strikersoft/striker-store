import { createDomainStore } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';
import { isObservableArray, when } from 'mobx';

describe('DomainStore - public methods', () => {
  let domainStore;
  beforeEach(() => {
    domainStore = createDomainStore({
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    });
  });

  it('getItem should return particular model by id', async () => {
    const { store } = domainStore;
    await store.fetchItems();

    expect(store.getItem(MockUserService.getMockModel().id)).toEqual(MockUserService.getMockModel());
  });
});
