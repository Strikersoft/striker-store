import { action, computed } from 'mobx';
import { deserialize, update, getDefaultModelSchema } from 'serializr';
import DomainModel from './domain-model';

export default class SchemaAdapter {
  constructor(schema, store) {
    this.schema = schema;
    this.store = store;
  }

  @action('deserialize payload of model')
  deserialize = (payload) => {
    const model = deserialize(this.schema, payload);

    if (!this.modelIdentifier) {
      throw new Error('Can\'t deserialize without identifier() in schema.');
    }

    if (model instanceof DomainModel) {
      model.reload = () => this.store.fetchOne(model[this.modelIdentifier]);
    }

    return model;
  };

  @action('update existing model')
  update = (model, payload) => update(model, payload);

  serialize() {
    throw new Error('not implemented');
  }

  @computed get modelIdentifier() {
    const modelSchema = getDefaultModelSchema(this.schema);
    let idx = null;

    Object.keys(modelSchema.props).some((key) => {
      if (modelSchema.props[key].identifier) {
        idx = key;
        return true;
      }

      return false;
    });

    return idx;
  }

  createEmpty() {
    return this.deserialize({ [this.modelIdentifier]: false });
  }

  @action('desrialize array of payload models')
  deserializeArray(payload) {
    return payload.map(this.deserialize);
  }

  getModelSchema(model) {
    return getDefaultModelSchema(model);
  }
}
