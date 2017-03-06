import { createDomainStore, DomainStoreConfig, DomainService, DomainStore, NextRouterState } from '../lib/index';
import { MockUserModel, MockUserService, MockUserServiceErrored } from './utils';
import { when } from 'mobx';

describe('createDomainStore - errorHandlers hooks', () => {
  it('triggers onItemResolveError', async () => {
    const onItemResolveError = jest.fn(() => ([]));

    const config: DomainStoreConfig = {
      name: 'users',
      serviceToInject: new MockUserServiceErrored(),
      domainModel: MockUserModel,
      errorHandlers: { onItemResolveError }
    };

    const itemResolver = createDomainStore(config).itemResolver;
    const nextState: NextRouterState = { params: { id: MockUserService.getMockModel().id.toString() }};

    try {
      await itemResolver(nextState, {}, () => {});
    } catch (e) { }

    expect(onItemResolveError).toBeCalled();
  });
});
