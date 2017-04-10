import { observable, runInAction, computed } from 'mobx';

import EntitiesAdapter from './entities-adapter';
import ServiceAdapter from './service-adapter';
import SchemaAdapter from './schema-adapter';
import DomainModel from './domain-model';
import LifecycleHooks from './lifecycle-hooks';
import Logger from './logger';

const registeredStores = {};

function resolveStore(storeName) {
  const store = registeredStores[storeName];

  this.logger.warn('Resolve store is experimental thing and can be changed in future');

  if (!store) {
    this.logger.warn(`Can't find store with name "${storeName}"`);
  }

  return store;
}

class BaseDomainStore {
  hooks = new LifecycleHooks(this, registeredStores);
  logger = new Logger(BaseDomainStore.name);

  isProcessing = observable.box(false);
  isListLoading = observable.box(false);
  isEmpty = observable.box(true);

  constructor() {
    this.service = new ServiceAdapter(this.constructor.service);
    this.schema = new SchemaAdapter(this.constructor.modelSchema, this);
    this.data = new EntitiesAdapter(this.schema);

    registeredStores[this.storeName] = this;
  }

  storeDidFetchAll({ response }) {
    return response;
  }

  storeDidFetchOne({ response }) {
    return response;
  }

  storeDidCreateNew({ response }) {
    return response;
  }

  async fetchAll(...args) {
    this.isProcessing.set(true);
    this.isListLoading.set(true);

    try {
      this.hooks.triggerWillFetchAll();

      const response = await this.service.fetchAll(...args);
      const slicedData = await this.hooks.triggerDidFetchAll(response);

      if (!Array.isArray(slicedData)) {
        throw new Error('DidFetchAll return not an array');
      }

      runInAction(() => {
        this.data.reset(slicedData);
        this.isProcessing.set(false);
        this.isEmpty.set(false);
        this.isListLoading.set(false);
      });

      return this.asArray;
    } catch (e) {
      this.logger.error(e);
      this.hooks.triggerFetchAllFailed(e);
      this.isListLoading.set(false);
      this.isProcessing.set(false);
      throw new Error(e);
    }
  }

  async fetchOne(id, ...args) {
    this.isProcessing.set(true);
    // TODO: thinks about separate adapter
    if (this.data.has(id)) {
      const model = this.data.get(id);

      // TODO: more strict check
      if (model.isReloading) {
        model.isReloading.set(true);
      }

      // TODO: more strict check
      if (model.isError) {
        model.isError.set(false);
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
        this.isProcessing.set(false);
        this.isEmpty.set(false);
      });

      return this.getOne(id);
    } catch (e) {
      this.logger.error(e);

      if (this.data.has(id)) {
        const model = this.data.get(id);

        if (model.isError) {
          model.isError.set(true);
        }
      }

      this.hooks.triggerFetchOneFailed(e);

      throw new Error(e);
    } finally {
      // TODO: dry ?
      const model = this.data.get(id);

      if (model.isReloading) {
        model.isReloading.set(false);
      }

      this.isProcessing.set(false);
    }
  }

  async createItem(model) {
    this.isProcessing.set(true);
    let preparedModel;

    // TODO: test
    if (model instanceof DomainModel) {
      preparedModel = model.serialize();

      if (model.isError) {
        model.isError.set(false);
      }

      if (model.isSaving) {
        model.isSaving.set(true);
      }

      // Removes ID property from model
      delete preparedModel[this.schema.modelIdentifier];
    } else {
      // In case when this is just user data
      preparedModel = model;
    }

    try {
      this.hooks.triggerWillCreateNew();

      const response = await this.service.createItem(preparedModel);
      const slicedData = await this.hooks.triggerDidCreateNew(response);

      if (Array.isArray(slicedData)) {
        throw new Error('Ypu return array instead of object');
      }

      runInAction(() => {
        this.data.addOrUpdate(slicedData);
        this.isProcessing.set(false);
        this.isEmpty.set(false);
      });
    } catch (e) {
      this.logger.error(e);
      this.hooks.triggerCreateNewFailed(e);

      if (model instanceof DomainModel) {
        if (model.isError) {
          model.isError.set(true);
        }
      }

      throw new Error(e);
    } finally {
      this.isProcessing.set(false);

      if (model instanceof DomainModel) {
        model.isSaving.set(false);
      }
    }
  }

  createEmpty() {
    return this.schema.createEmpty();
  }

  @computed get asArray() {
    return this.data.array;
  }

  getMap = () => this.data.entities;

  getOne = id => this.data.get(id);

  has = id => this.data.has(id);

  get storeName() {
    return this.constructor.storeName || this.constructor.name;
  }
}

export { DomainModel, BaseDomainStore, resolveStore };
