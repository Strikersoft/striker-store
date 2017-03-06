import { observable, action, computed, extendObservable, ObservableMap, Iterator } from 'mobx';
import { deserialize, update, serializable, ModelSchema } from 'serializr';
import DomainStore from './domain-store';

export interface Selectors {
  paramsSelector?: (nextState: NextRouterState) => any;
  paramsItemSelector?: (nextState: NextRouterState) => any;
  paramsModelSelector?: (nextState: NextRouterState) => string | number;
  listSelector?: (data: any) => {}[];
  itemSelector?: (model: any) => {};
}

export interface RouterParams {
  id: string;
}

export interface NextRouterState {
  params: RouterParams;
}

export interface DomainService {
  fetch (...args): PromiseLike<any>;
  fetchOne (...args): PromiseLike<any>;
  query? (...args): PromiseLike<any>;
}

export interface ErrorHandlers {
  onItemResolveError?: () => void;
  onListResolveError?: () => void;
}

export interface RouterHooks {
  onItemResolve?: () => void;
  onListResolve?: () => void;
}

export interface DomainStoreConfig {
  name: string;
  serviceToInject: DomainService;
  domainModel: ModelSchema<any> | (new () => any);
  modelKey?: string | number;
  selectors?: Selectors;
  errorHandlers?: ErrorHandlers;
  routerHooks?: RouterHooks;
}

export interface DomainStoreResponse {
  store: DomainStore;
  listResolver: (nextState: NextRouterState, replace, callback: () => void) => void;
  itemResolver: (nextState: NextRouterState, replace, callback: () => void) => void;
}

export { DomainStore };

export function createDomainStore(config: DomainStoreConfig) {

  const store = new DomainStore(
    config.name, config.serviceToInject, config.domainModel, config.selectors, config.modelKey || 'id'
  );
  const { selectors = {} } = config;

  function listResolver(nextState: NextRouterState, replace, callback: () => void) {
    const fetch = store.fetchItems(selectors.paramsSelector ? selectors.paramsSelector(nextState) : []);

    let triggered = false;
    if (store.data.size > 0) {
      callback();
      triggered = true;
    }

    let onError = null;
    if (config.errorHandlers && config.errorHandlers.onListResolveError) {
      onError = config.errorHandlers.onListResolveError;
    }

    let onResolve = null;
    if (config.routerHooks && config.routerHooks.onListResolve) {
      onResolve = config.routerHooks.onListResolve;
    }

    return fetch.then(onResolve, onError).then(triggered ? null : callback);
  }

  function itemResolver(nextState: NextRouterState, replace, callback: () => void) {
    const item = store.getItem(selectors.paramsModelSelector ? selectors.paramsModelSelector(nextState) : nextState.params.id);
    const fetch = store.fetchItemById(selectors.paramsItemSelector ? selectors.paramsItemSelector(nextState) : nextState.params.id);

    let triggered = false;
    if (item) {
      callback();
      triggered = true;
    }

    let onError = null;
    if (config.errorHandlers && config.errorHandlers.onItemResolveError) {
      onError = config.errorHandlers.onItemResolveError;
    }

    let onResolve = null;
    if (config.routerHooks && config.routerHooks.onItemResolve) {
      onResolve = config.routerHooks.onItemResolve;
    }

    return fetch.then(onResolve, onError).then(triggered ? null : callback);
  }

  return { store, listResolver, itemResolver } as DomainStoreResponse;
}
