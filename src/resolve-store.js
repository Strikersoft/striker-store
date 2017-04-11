import registeredStores from './registered-stores';

function resolveStore(storeName) {
  const store = registeredStores[storeName];

  this.logger.warn('Resolve store is experimental thing and can be changed in future');

  if (!store) {
    this.logger.warn(`Can't find store with name "${storeName}"`);
  }

  return store;
}

export default resolveStore;
