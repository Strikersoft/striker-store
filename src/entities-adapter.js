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
      const item = this.get(id);

      if (this.has(id)) {
        this.schema.update(item, model);
        newEntities[id] = item;
      } else {
        newEntities[id] = this.schema.deserialize(model);
      }
    });

    this.entities.replace(newEntities);
  }

  addOrUpdate(model) {
    const identifier = this.schema.modelIdentifier;
    const id = model[identifier];
    const item = this.get(id);

    if (this.has(id)) {
      this.schema.update(item, model);
      this.entities.set(id, item);
    } else {
      this.entities.set(id, this.schema.deserialize(model));
    }
  }

  has(id) {
    return this.entities.has(id);
  }

  @action
  get(id) {
    return this.entities.get(id);
  }

  get array() {
    return this.entities.values();
  }
}
