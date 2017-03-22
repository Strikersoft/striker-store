import { observable, runInAction, action, computed } from 'mobx';
import { createViewModel } from 'mobx-utils';

import { EntitiesAdapter } from './entities-adapter';
import { ServiceAdapter } from './service-adapter';
import { SchemaAdapter, registerModelHooks } from './schema-adapter';
import { Logger } from './logger';


// TODO: rethink decorators. now logic is too complicated
function createDecoratedProp(model, prop) {
  Object.defineProperty(model, prop, {
    configurable: true,
    writable: true,
    enumerable: false
  });
}

export class ViewModel {
  reusedViewModel;

  get viewModel() {
    if (!this.reusedViewModel) {
      this.reusedViewModel = createViewModel(this);
      return this.reusedViewModel;
    }

    return this.reusedViewModel;
  }
}

export function loadingState(model, prop) {
  createDecoratedProp(model, prop);
  registerModelHooks(model, 'isLoading', prop);
  return model;
}

export function errorState(model, prop) {
  createDecoratedProp(model, prop);
  registerModelHooks(model, 'isError', prop);
  return model;
}

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

  triggerDidFetchOne(data) {
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
  isEmpty = observable.box(true);

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

  createEmpty() {
    return this.schema.createEmpty();
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
        this.isEmpty.set(false);
      });
    } catch (e) {
      this.logger.error(e);
      this.hooks.triggerFetchAllFailed(e);
      throw new Error(e);
    }
  }

  async fetchOne(id, ...args) {
    this.isProcessing = true;
    // TODO: thinks about separate adapter
    if (this.data.has(id)) {
      const model = this.data.get(id);
      const loadingHookProp = this.schema.getLoadingHookProp(model);
      const errorHookProp = this.schema.getErrorHookProp(model);

      if (loadingHookProp) {
        model[loadingHookProp].set(true);
      }

      if (errorHookProp) {
        model[errorHookProp].set(false);
      }
    }

    try {
      this.hooks.triggerWillFetchOne();

      const response = await this.service.fetchOne(id, ...args);
      const slicedData = await this.hooks.triggerDidFetchOne(response);

      if (Array.isArray(slicedData)) {
        throw new Error('DidFetchOne return an array');
      }

      runInAction(() => {
        this.data.addOrUpdate(slicedData);
        this.isProcessing = false;
        this.isEmpty.set(false);
      });

      return this.getOne(id);
    } catch (e) {
      this.logger.error(e);

      if (this.data.has(id)) {
        const model = this.data.get(id);
        const errorHookProp = this.schema.getErrorHookProp(model);

        if (errorHookProp) {
          model[errorHookProp].set(true);
        }
      }
      this.hooks.triggerFetchOneFailed(e);

      throw new Error(e);
    } finally {
      // TODO: dry ?
      const model = this.data.get(id);
      const loadingHookProp = this.schema.getLoadingHookProp(model);

      if (loadingHookProp) {
        model[loadingHookProp].set(false);
      }
    }
  }

  getMap = () => {
    return this.data.entities;
  }

  getOne = (id) => {
    return this.data.get(id);
  }

  has = (id) => {
    return this.data.has(id);
  };

  get isBusy() {
    return this.isProcessing;
  }

  @computed get asArray() {
    return this.data.array;
  }

  get storeName() {
    return this.constructor.storeName || this.constructor.name;
  }
}
