import { observable, action, computed, extendObservable, ObservableMap, Iterator } from 'mobx';
import { deserialize, update, serializable, ModelSchema } from 'serializr';
import { DomainService } from './domain-service';
import { Selectors, NextRouterState } from './domain-selectors';
import DomainStore from './domain-store';

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

export { DomainService };
export { DomainStore };

export function createDomainStore(config: DomainStoreConfig) {

  const store = new DomainStore(config.name, config.serviceToInject, config.domainModel, config.selectors);
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
