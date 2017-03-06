import { ModelSchema } from 'serializr';
import { ObservableMap, Iterator } from 'mobx';

export class DomainStore {
    private __data__;
    private __rawData__;
    private serviceToInject;
    private selectors;
    private name;
    private modelKey;
    private model;
    constructor(name: string, service: DomainService, domainModel: ModelSchema<any> | (new () => any), selectors: Selectors, modelKey: string | number);
    fetchItems<T>(...args: any[]): PromiseLike<T>;
    fetchItemById<T>(...args: any[]): PromiseLike<T>;
    queryItems<T>(...args: any[]): PromiseLike<T>;
    resetItems(data: any): ObservableMap<{}>;
    addOrUpdateItem(model: {}): ObservableMap<{}>;
    getItem(id: string | number): {};
    readonly list: {}[] & Iterator<{}>;
    private getModelIdentifier(model);
    readonly rawData: any;
    readonly data: ObservableMap<{}>;
    private itemSelector(response);
    private listSelector(response);
}

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
    fetch(...args: any[]): PromiseLike<any>;
    fetchOne(...args: any[]): PromiseLike<any>;
    query?(...args: any[]): PromiseLike<any>;
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

export declare function createDomainStore(config: DomainStoreConfig): DomainStoreResponse;
