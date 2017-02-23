import { observable, action, computed, extendObservable, ObservableMap, Iterator } from 'mobx';
import { deserialize, update, serializable, ModelSchema } from 'serializr';
import DomainStore from './domain-store';

export interface Selectors {
  paramsSelector?: (nextState: NextRouterState) => NextRouterState;
  paramsItemSelector?: (nextState: NextRouterState) => NextRouterState;
  listSelector?: (data: any) => {}[];
  itemSelector?: (model: any) => {};
}

export interface RouterParams {
  id: string;
}

export interface NextRouterState {
  params: RouterParams;
  [propName: string]: any;
}


export interface DomainService {
  fetch (...args): PromiseLike<any>;
  fetchOne (...args): PromiseLike<any>;
  query (...args): PromiseLike<any>;
}


export interface DomainStoreConfig {
  name: string;
  serviceToInject: DomainService;
  domainModel: ModelSchema<any> | (new () => any);
  modelKey?: string | number;
  selectors?: Selectors;
}

export interface DomainStoreResponse {
  store: DomainStore;
  listResolver: (nextState: NextRouterState, replace, callback: () => void) => void;
  itemResolver: (nextState: NextRouterState, replace, callback: () => void) => void;
}

export { DomainStore };

export function createDomainStore(config: DomainStoreConfig) {

  const store = new DomainStore(config.name, config.serviceToInject, config.domainModel, config.selectors, config.modelKey || 'id');
  const { selectors = {} } = config;

  function listResolver(nextState: NextRouterState, replace, callback: () => void) {
    const fetch = store.fetchItems(selectors.paramsSelector ? selectors.paramsSelector(nextState) : []);

    if (store.data.size > 0) {
      callback();
    } else {
      fetch.then(() => { callback(); });
    }
  }

  function itemResolver(nextState: NextRouterState, replace, callback: () => void) {
    const item = store.getItem(nextState.params.id);
    const fetch = store.fetchItemById(selectors.paramsItemSelector ? selectors.paramsItemSelector(nextState) : nextState.params.id);

    if (item) {
      callback();
    } else {
      fetch.then(() => { callback(); });
    }
  }

  return { store, listResolver, itemResolver } as DomainStoreResponse;
}
