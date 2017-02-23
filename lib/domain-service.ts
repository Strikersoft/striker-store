export interface DomainService {
  fetch (...args): PromiseLike<any>;
  fetchOne (...args): PromiseLike<any>;
}
