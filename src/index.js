import { observable, runInAction, computed } from 'mobx';

import { EntitiesAdapter } from './entities-adapter';
import { ServiceAdapter } from './service-adapter';
import { SchemaAdapter } from './schema-adapter';
import { Logger } from './logger';


class LifecycleHooks {
  constructor(ref, registeredStores) {
    this.logger = new Logger(LifecycleHooks.name);
    this.ref = ref;
    this.registeredStores = registeredStores;
  }

  triggerDidFetchAll(data) {
    if (!this.ref.storeDidFetchAll) {
      throw new Error('no required LifecycleHook - storeDidFetchAll');
    }

    const sliced = this.ref.storeDidFetchAll({ response: data, stores: this.registeredStores });
    this.logger.debug('Hook storeDidFetchAll triggered', sliced);

    return sliced;
  }

  triggerDidFetchOne() {
    if (!this.ref.storeDidFetchOne) {
      throw new Error('no required LifecycleHook - storeDidFetchOne');
    }

    const sliced = this.ref.storeDidFetchOne({ response: data, stores: this.registeredStores });
    this.logger.debug('Hook storeDidFetchOne triggered', sliced);

    return sliced;
  }

  triggerFetchAllFailed(error) {
    if (this.ref.storeFetchAllFailed) {
      this.ref.storeFetchAllFailed(error);
      this.logger.debug('Hook storeFetchAllFailed triggered', error);
    }
  }

  triggerFetchOneFailed(error) {
    if (this.ref.storeFetchOneFailed) {
      this.ref.storeFetchOneFailed(error);
      this.logger.debug('Hook storeFetchOneFailed triggered', error);
    }
  }

  triggerWillFetchAll() {
    if (this.ref.storeWillFetchAll) {
      this.ref.storeWillFetchAll();
      this.logger.debug('Hook storeWillFetchAll triggered');
    }
  }

  triggerWillFetchOne() {
    if (this.ref.storeWillFetchOne) {
      this.ref.storeWillFetchOne();
      this.logger.debug('Hook storeWillFetchAll triggered');
    }
  }
}

const registeredStores = {};

export function resolveStore(storeName) {
  const store = registeredStores[storeName];

  this.logger.warn(`Resolve store is experimental thing and can be changed in future`);

  if (!store) {
    this.logger.warn(`Can't find store with name "${storeName}"`);
  }

  return store;
}

export class BaseDomainStore {
  hooks = new LifecycleHooks(this, registeredStores);
  logger = new Logger(BaseDomainStore.name);

  @observable isProcessing = false;

  constructor() {
    this.service = new ServiceAdapter(this.constructor.service);
    this.schema = new SchemaAdapter(this.constructor.modelSchema);
    this.data = new EntitiesAdapter(this.schema);

    registeredStores[this.storeName] = this;
  }

  storeDidFetchAll({ response }) {
    return response;
  }

  storeDidFetchOne({ response }) {
    return response;
  }

  async fetchAll(...args) {
    this.isProcessing = true;

    try {
      this.hooks.triggerWillFetchAll();

      const response = await this.service.fetchAll(...args);
      const slicedData = await this.hooks.triggerDidFetchAll(response);

      if (!Array.isArray(slicedData)) {
        throw new Error('DidFetchAll return not an array');
      }

      runInAction(() => {
        this.data.reset(slicedData);
        this.isProcessing = false;
      });
    } catch (e) {
      this.logger.error(e);
      this.hooks.triggerFetchAllFailed(e);
      throw new Error(e);
    }
  }

  async fetchOne(...args) {
    this.isProcessing = true;

    try {
      this.hooks.triggerWillFetchOne();

      const response = await this.service.fetchAll(...args);
      const slicedData = await this.hooks.triggerDidFetchOne(response);

      if (Array.isArray(slicedData)) {
        throw new Error('DidFetchAll return an array');
      }

      runInAction(() => {
        this.data.reset([slicedData]);
        this.isProcessing = false;
      });
    } catch (e) {
      this.logger.error(e);
      this.hooks.triggerFetchOneFailed(e);
      throw new Error(e);
    }
  }

  getMap = () => {
    return this.data.entities;
  }

  getOne = (id) => {
    return this.data.getItem(id);
  }

  get isBusy() {
    return this.isProcessing;
  }

  get asArray() {
    return this.data.array;
  }

  get storeName() {
    return this.constructor.name;
  }
}
