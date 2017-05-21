interface IObservableValue<T> {
    get(): T;
    set(value: T): void;
}

declare class DomainModel<T> {
  isReloading: IObservableValue<T>;
  isError: IObservableValue<T>;
  isSaving: IObservableValue<T>;
  isSaved: IObservableValue<T>;
  isUpdating: IObservableValue<T>;
  isDeleting: IObservableValue<T>;
  isDeleted: IObservableValue<T>;
  viewModel;

  serialize();
}

declare class BaseDomainStore {
    isProcessing: IObservableValue<{}>;
    isListLoading: IObservableValue<{}>;;
    isEmpty: IObservableValue<{}>;

    storeDidFetchAll();
    storeDidFetchOne();
    storeDidCreateNew();
    storeDidUpdate();
    storeDidDelete();

    storeWillFetchAll();
    storeWillFetchOne();
    storeWillCreateNew();
    storeWillUpdate();
    storeWillDelete();

    storeFetchAllFailed();
    storeFetchOneFailed();
    storeCreateNewFailed();
    storeUpdateFailed();
    storeDeleteFailed();

    fetchAll<T>(...args): PromiseLike<T>;
    fetchOne<T>(id, ...args): PromiseLike<T>;
    deleteItem<T>(model): PromiseLike<T>;
    updateItem<T>(model): PromiseLike<T>;
    createItem<T>(model): PromiseLike<T>;

    createEmpty();

    getMap();
    getOne();
    has();
    getStoreName();

    asArray;
}

declare function resolveStore(name: string);

export { BaseDomainStore, DomainModel, resolveStore };
