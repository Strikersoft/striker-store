import { deserialize, update, serializable, ModelSchema } from 'serializr';

export interface Selectors {
  paramsSelector?: (nextState: NextRouterState) => NextRouterState;
  paramsItemSelector?: (nextState: NextRouterState) => NextRouterState;
  listSelector?: (data: any) => {}[];
  itemSelector?: (model: any) => {};
}

export interface RouterParams {
  id: string;
}

export interface NextRouterState {
  params: RouterParams;
  [propName: string]: any;
}
