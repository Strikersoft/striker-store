import { action, computed, observable } from 'mobx';
import { deserialize, update, getDefaultModelSchema } from 'serializr';


const registeredModelHooks = {};

// TODO: thinks about model names (mb store pointers instead of names ?)
function getModelName(model) {
  return model.constructor.modelName || model.constructor.name;
}

export function registerModelHooks(model, hook, name) {
  registeredModelHooks[getModelName(model)] = {
    [hook]: name,
    ...registeredModelHooks[getModelName(model)]
  };
}


export class SchemaAdapter {
  constructor(schema) {
    this.schema = schema;
  }

  @action('deserialize payload of model')
  deserialize = (payload) => {
    const modelSchema = this.getModelSchema();
    const model = deserialize(this.schema, payload);

    const loadingHookProp = this.getLoadingHookProp(model);
    const errorHookProp = this.getErrorHookProp(model);

    if (loadingHookProp) {
      model[loadingHookProp] = observable.box(false);
    }

    if (errorHookProp) {
      model[errorHookProp] = observable.box(false);
    }

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

  createEmpty() {
    return this.deserialize({ [this.modelIdentifier]: false });
  }

  @action('desrialize array of payload models')
  deserializeArray(payload) {
    return payload.map(this.deserialize);
  }

  getLoadingHookProp(model) {
    if (registeredModelHooks[getModelName(model)]) {
      return registeredModelHooks[getModelName(model)].isLoading;
    }
  }

  getErrorHookProp(model) {
    if (registeredModelHooks[getModelName(model)]) {
      return registeredModelHooks[getModelName(model)].isError;
    }
  }

  getModelSchema(model) {
    return getDefaultModelSchema(model);
  }
}
