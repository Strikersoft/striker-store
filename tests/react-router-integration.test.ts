import { createDomainStore, DomainStoreConfig, DomainStoreResponse } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';

describe('createDomainStore - resolvers', () => {
  let storeResp: DomainStoreResponse;

  beforeEach(() => {
    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    };

    storeResp = createDomainStore(config);
  });

  it('should resolve item for react-router', (done) => {
    const { store, itemResolver, listResolver } = storeResp;

    itemResolver({ params: { id: MockUserService.getMockModel().id.toString() }}, {}, () => {
      expect(store.data.size).toBeGreaterThan(0);
      done();
    });
  });

  it('should resolve list for react-router', (done) => {
    const { store, itemResolver, listResolver } = storeResp;

    listResolver({ params: { id: MockUserService.getMockModel().id.toString() }}, {}, () => {
      expect(store.data.size).toBeGreaterThan(0);
      done();
    });
  });
});
