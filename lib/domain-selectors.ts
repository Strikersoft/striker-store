import { deserialize, update, serializable, ModelSchema } from 'serializr';

export interface Selectors<T> {
    paramsSelector?: (nextState:NextRouterState) => NextRouterState;
    paramsItemSelector?: (nextState:NextRouterState) => NextRouterState;
    dataSelector?: (data:ModelSchema<T> | (new () => T)[]) => ModelSchema<T> | (new () => T)[];
    modelNormalizer?: (model:ModelSchema<T> | (new () => T)) => ModelSchema<T> | (new () => T);
}

export interface RouterParams {
    id: string;
}

export interface NextRouterState {
    params: RouterParams;
    [propName:string]: any;
}