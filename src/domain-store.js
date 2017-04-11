import { observable, runInAction, computed } from 'mobx';

import EntitiesAdapter from './entities-adapter';
import ServiceAdapter from './service-adapter';
import SchemaAdapter from './schema-adapter';
import LifecycleHooks from './lifecycle-hooks';
import Logger from './logger';
import DomainModel from './domain-model';

import registeredStores from './registered-stores';


export default class BaseDomainStore {
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
    runInAction(() => {
      this.isProcessing.set(true);
      this.isListLoading.set(true);
    });

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
    runInAction(() => {
      this.isProcessing.set(true);

      if (this.data.has(id)) {
        const model = this.data.get(id);

        if (model.isReloading) {
          model.isReloading.set(true);
        }

        // TODO: more strict check
        if (model.isError) {
          model.isError.set(false);
        }
      }
    });

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
      runInAction(() => {
        const model = this.data.get(id);

        if (model.isReloading) {
          model.isReloading.set(false);
        }

        this.isProcessing.set(false);
      });

    }
  }

  async createItem(model) {
    let preparedModel;

    runInAction(() => {
      this.isProcessing.set(true);

      // TODO: test
      if (model instanceof DomainModel) {
        preparedModel = model.serialize();

        model.isError.set(false);
        model.isSaving.set(true);

        // Removes ID property from model
        delete preparedModel[this.schema.modelIdentifier];
      } else {
        // In case when this is just user data
        preparedModel = model;
      }
    });

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

        if (model instanceof DomainModel) {
          model.isSaved.set(true);
        }
      });
    } catch (e) {
      this.logger.error(e);
      this.hooks.triggerCreateNewFailed(e);

      runInAction(() => {
        if (model instanceof DomainModel) {
          model.isError.set(true);
          model.isSaved.set(false);
        }
      });

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
