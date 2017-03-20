export class ServiceAdapter {
  constructor(service) {
    this.service = service;
  }

  fetchAll(...args) {
    return this.service.fetchAll(...args);
  }

  fetchOne(...args) {
    return this.service.fetchOne(...args);
  }
}
