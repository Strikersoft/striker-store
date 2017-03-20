import { observable, computed, action } from 'mobx';

export class EntitiesAdapter {
  @observable entities = observable.map({});

  constructor(schema) {
    this.schema = schema;
  }

  @action('reset models in store')
  reset(models) {
    const identifier = this.schema.modelIdentifier;
    const newEntities = {};

    models.forEach((model) => {
      const id = model[identifier];
      const item = this.entities.get(id);

      if (this.entities.has(id)) {
        this.schema.update(item, model);
        newEntities[id] = item;
      } else {
        newEntities[id] = this.schema.deserialize(model);
      }
    });

    this.entities.replace(newEntities);
  }

  @action
  getItem(id) {
    return this.entities.get(id);
  }

  @computed get array() {
    return this.entities.values();
  }
}
