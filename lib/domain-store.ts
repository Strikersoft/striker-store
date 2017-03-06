import { observable, action, computed, extendObservable, ObservableMap, Iterator } from 'mobx';
import { deserialize, update, serializable, ModelSchema } from 'serializr';
import { invariant } from './utils';
import { DomainService, Selectors } from './index';

export default class DomainStore {
  @observable private __data__ = observable.map({});
  private __rawData__;

  private serviceToInject: DomainService;
  private selectors: Selectors;
  private name: string;
  private modelKey: string | number;
  private model: ModelSchema<any> | (new () => any);

  constructor(
    name: string,
    service: DomainService,
    domainModel: ModelSchema<any> | (new () => any),
    selectors: Selectors,
    modelKey: string | number
  ) {
    this.name = name;
    this.serviceToInject = service;
    this.selectors = selectors || {};
    this.model = domainModel;
    this.modelKey = modelKey;
  }

  public fetchItems<T>(...args): PromiseLike<T> {
    return new Promise((resolve, reject) => {
      return this.serviceToInject.fetch(...args)
        .then((response) => this.resetItems(response))
        .then(resolve, reject);
    });
  }

  public fetchItemById<T>(...args): PromiseLike<T> {
    return new Promise((resolve, reject) => {
      return this.serviceToInject.fetchOne(...args)
        .then((model) => this.addOrUpdateItem(this.itemSelector(model)))
        .then(resolve, reject);
    });
  }

  public queryItems<T>(...args): PromiseLike<T> {
    return new Promise((resolve, reject) => {
      return this.serviceToInject.query(...args)
        .then((response) => this.resetItems(response))
        .then(resolve, reject);
    });
  }

  @action.bound
  public resetItems(data): ObservableMap<{}> {
    this.__rawData__ = data;

    const newItems = {};
    const select = this.listSelector(data);

    select.forEach((model) => {
      const identifier = this.getModelIdentifier(model);
      if (!identifier) {
        invariant(`Response contains invalid models. Identifier=${this.modelKey}, Response`, data, model);
        return;
      }

      if (this.data.has(identifier)) {
        this.addOrUpdateItem(model);
        newItems[identifier] = this.getItem(identifier);
        return;
      }

      newItems[identifier] = deserialize(this.model, model);
    });

    this.__data__ = observable.map(newItems);
    return this.data;
  }

  @action
  public addOrUpdateItem(model: {}): ObservableMap<{}> {
    const identifier = this.getModelIdentifier(model);

    if (!identifier) {
      invariant(`Response contains invalid models. Identifier=${this.modelKey}, Response`, model);
      return;
    }

    if (this.data.has(this.getModelIdentifier(model))) {
      update(this.getItem(this.getModelIdentifier(model)), model);
    } else {
      this.data.set(this.getModelIdentifier(model), deserialize(this.model, model));
    }

    return this.data;
  }

  public getItem(id: string | number ): {} {
    if (!id) {
      invariant(`Item not found by id=${id}`);
      return;
    }

    return this.data.get(id.toString());
  }

  @computed
  get list(): {}[] & Iterator<{}> {
    return this.data.values();
  }

  private getModelIdentifier(model: Object): string | null {
    if (model[this.modelKey]) {
      return model[this.modelKey].toString();
    }

    return null;
  }

  public get rawData(): any {
    return this.__rawData__;
  }

  public get data(): ObservableMap<{}> {
    return this.__data__;
  }

  private itemSelector(response) {
    return this.selectors.itemSelector ? this.selectors.itemSelector(response) : response;
  }

  private listSelector(response) {
    return this.selectors.listSelector ? this.selectors.listSelector(response) : response;
  }
}
