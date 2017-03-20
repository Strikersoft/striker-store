import { action, computed } from 'mobx';
import { deserialize, update, getDefaultModelSchema } from 'serializr';

export class SchemaAdapter {
  constructor(schema) {
    this.schema = schema;
  }

  @action('deserialize payload of model')
  deserialize = (payload) => {
    const modelSchema = this.getModelSchema();
    const model = deserialize(this.schema, payload);

    if (!this.modelIdentifier) {
      throw new Error(`Can't deserialize without identifier() in schema.`);
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

    // TODO: ponyffil required
    Object.keys(modelSchema.props).some((key) => {
      if (modelSchema.props[key].identifier) {
        idx = key
        return true;
      }

      return false;
    });

    return idx;
  }

  @action('desrialize array of payload models')
  deserializeArray(payload) {
    return payload.map(this.deserialize);
  }

  getModelSchema(model) {
    return getDefaultModelSchema(model);
  }
}
