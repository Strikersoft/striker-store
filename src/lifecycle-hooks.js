import Logger from './logger';

export default class LifecycleHooks {
  constructor(ref, registeredStores) {
    this.logger = new Logger(LifecycleHooks.name);
    this.ref = ref;
    this.registeredStores = registeredStores;
  }

  async triggerDidFetchAll(data) {
    if (!this.ref.storeDidFetchAll) {
      throw new Error('no required LifecycleHook - storeDidFetchAll');
    }

    const sliced = await this.ref.storeDidFetchAll({
      response: data, stores: this.registeredStores
    });

    this.logger.debug('Hook storeDidFetchAll triggered', sliced);

    return sliced;
  }

  async triggerDidFetchOne(data) {
    if (!this.ref.storeDidFetchOne) {
      throw new Error('no required LifecycleHook - storeDidFetchOne');
    }

    const sliced = await this.ref.storeDidFetchOne({
      response: data, stores: this.registeredStores
    });

    this.logger.debug('Hook storeDidFetchOne triggered', sliced);

    return sliced;
  }

  async triggerDidCreateNew(data) {
    if (!this.ref.storeDidCreateNew) {
      throw new Error('no required LifecycleHook - storeDidCreateNew');
    }

    const sliced = await this.ref.storeDidCreateNew({
      response: data, stores: this.registeredStores
    });

    this.logger.debug('Hook storeDidCreateNew triggered', sliced);

    return sliced;
  }

  async triggerDidUpdate(data) {
    if (!this.ref.storeDidUpdate) {
      throw new Error('no required LifecycleHook - storeDidUpdate');
    }

    const sliced = await this.ref.storeDidUpdate({
      response: data, stores: this.registeredStores
    });

    this.logger.debug('Hook storeDidUpdate triggered', sliced);

    return sliced;
  }

  async triggerDidDelete(data) {
    if (!this.ref.storeDidDelete) {
      throw new Error('no required LifecycleHook - triggerDidDelete');
    }

    const sliced = await this.ref.storeDidDelete({
      response: data, stores: this.registeredStores
    });

    this.logger.debug('Hook storeDidDelete triggered', sliced);

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

  triggerCreateNewFailed(error) {
    if (this.ref.storeCreateNewFailed) {
      this.ref.storeCreateNewFailed(error);
      this.logger.debug('Hook storeCreateNewFailed triggered', error);
    }
  }

  triggerDeleteNewFailed(error) {
    if (this.ref.storeDeleteFailed) {
      this.ref.storeDeleteFailedd(error);
      this.logger.debug('Hook storeDeleteFailed triggered', error);
    }
  }

  triggerDidUpdateFailed(error) {
    if (this.ref.storeDidFailed) {
      this.ref.storeDidFailed(error);
      this.logger.debug('Hook storeDidFailed triggered', error);
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

  triggerWillCreateNew() {
    if (this.ref.storeWillCreateNew) {
      this.ref.storeWillCreateNew();
      this.logger.debug('Hook storeWillCreateNew triggered');
    }
  }

  triggerWillUpdate() {
    if (this.ref.storeWillUpdate) {
      this.ref.storeWillUpdate();
      this.logger.debug('Hook storeWillUpdate triggered');
    }
  }

  triggerWillDelete() {
    if (this.ref.storeWillDelete) {
      this.ref.storeWillDelete();
      this.logger.debug('Hook storeWillDelete triggered');
    }
  }
}
