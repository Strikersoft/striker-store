import { deserialize, update, serializable, ModelSchema } from 'serializr';

export interface Selectors<T> {
  paramsSelector?: (nextState: NextRouterState) => NextRouterState;
  paramsItemSelector?: (nextState: NextRouterState) => NextRouterState;
  dataSelector?: (data: {}[]) => {}[];
  modelNormalizer?: (model: {}) => {};
}

export interface RouterParams {
  id: string;
}

export interface NextRouterState {
  params: RouterParams;
  [propName: string]: any;
}
