import { observable, action, computed, extendObservable, ObservableMap, Iterator } from 'mobx';
import { deserialize, update, serializable, ModelSchema } from 'serializr';
import { DomainService } from './lib/domain-service';
import { Selectors, NextRouterState } from './lib/domain-selectors';
import DomainStore from './lib/domain-store';

export interface DomainStoreConfig<T> {
    name: string;
    serviceToInject: DomainService;
    domainModel: ModelSchema<T> | (new () => T),
    modelKey?: string | number;
    selectors?: Selectors<T>
}

export { DomainService };

export function createDomainStore<T>(config:DomainStoreConfig<T>) {
    const { name, serviceToInject, domainModel } = config;
    const { paramsSelector = null, paramsItemSelector = null, dataSelector = null, modelNormalizer = null } = config.selectors || {};

    const store = new DomainStore(name, serviceToInject, domainModel, config.selectors || {});

    function listResolver(nextState: NextRouterState, replace, callback: () => void) {
        if (store.data.size > 0) {
            callback();
            store.fetchItems(paramsSelector ? paramsSelector(nextState) : []);
        } else {
            store.fetchItems(paramsSelector ? paramsSelector(nextState) : []).then(() => { callback(); })
        }
    }

    function itemResolver(nextState: NextRouterState, replace, callback: () => void) {
        const item = store.getItem(nextState.params.id);

        if (item) {
            callback();
            store.fetchItemById(paramsItemSelector ? paramsItemSelector(nextState) : nextState.params.id)
        } else {
            store.fetchItemById(paramsItemSelector ? paramsItemSelector(nextState) : nextState.params.id)
                .then(() => {callback();})
        }
    }

    return { store, listResolver, itemResolver };
}
