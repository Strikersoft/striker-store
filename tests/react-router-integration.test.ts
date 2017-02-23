import { createDomainStore } from '../lib/index';
import { MockUserModel, MockUserService } from './utils';

describe('createDomainStore - resolvers', () => {
  let domainStore;
  beforeEach(() => {
    domainStore = createDomainStore({
      name: 'users',
      serviceToInject: new MockUserService(),
      domainModel: MockUserModel
    });
  });

  it('should resolve item for react-router', (done) => {
    const { store, itemResolver, listResolver } = domainStore;

    itemResolver({ params: { id: MockUserService.getMockModel().id.toString() }}, {}, () => {
      expect(store.data.size).toBeGreaterThan(0);
      done();
    });
  });

  it('should resolve list for react-router', (done) => {
    const { store, itemResolver, listResolver } = domainStore;

    listResolver({ params: { id: MockUserService.getMockModel().id.toString() }}, {}, () => {
      expect(store.data.size).toBeGreaterThan(0);
      done();
    });
  });
});
