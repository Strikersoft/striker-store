import { observable, action, computed, extendObservable, ObservableMap, Iterator } from 'mobx';
import { deserialize, update, serializable, ModelSchema } from 'serializr';
import { DomainService } from './domain-service';
import { Selectors } from './domain-selectors';


export default class DomainStore<T> {
    @observable private __data__ = observable.map({});
    private __rawData__;

    private serviceToInject: DomainService;
    private selectors: Selectors<T>;
    private name: string;
    private modelKey: string | number;
    private model: ModelSchema<T> | (new () => T);

    constructor(name: string, service: DomainService, domainModel: ModelSchema<T> | (new () => T), selectors: Selectors<T>, modelKey = 'id') {
        this.name = name;
        this.serviceToInject = service;
        this.selectors = selectors;
        this.model = domainModel;
        this.modelKey = modelKey;
    }

    public fetchItems<T>(...args): PromiseLike<T> {
        return this.serviceToInject.fetch(...args)
            .then(this.resetItems);
    }

    public fetchItemById<T>(...args): PromiseLike<T> {
        return this.serviceToInject.fetchOne(...args)
            .then((model) => this.addOrUpdateItem(model));
    }

    @action.bound
    public resetItems(data): ObservableMap<{}> {
        this.__rawData__ = data;

        const newItems = {};
        const select = (this.selectors.dataSelector ? this.selectors.dataSelector(data) : data);

        select.forEach((model) => {
            if (this.data.has(this.getModelIdentifier(model))) {
                this.addOrUpdateItem(model);
                newItems[this.getModelIdentifier(model)] = this.getItem(this.getModelIdentifier(model));
                return;
            }

            newItems[this.getModelIdentifier(model)] = deserialize(this.model, model);
        });

        this.__data__ = observable.map(newItems);
        return this.data;
    }

    @action
    public addOrUpdateItem(model): ObservableMap<{}> {
        // TODO: dublicates logic with data selector (see patients store)
        const adapted = this.selectors.modelNormalizer ? this.selectors.modelNormalizer(model) : model;
        if (this.data.has(this.getModelIdentifier(adapted))) {
            update(this.getItem(this.getModelIdentifier(adapted)), model);
        } else {
            this.data.set(this.getModelIdentifier(adapted), deserialize(this.model, adapted));
        }

        return this.data;
    }

    getItem(id: string | number ): {} {
        return this.data.get(id.toString());
    }

    @computed
    get list(): {}[] & Iterator<{}> {
        return this.data.values();
    }

    private getModelIdentifier(model: Object): string {
        return model[this.modelKey].toString();
    }

    public get rawData(): any {
        return this.__rawData__;
    }

    public get data(): ObservableMap<{}> {
        return this.__data__;
    }
}
