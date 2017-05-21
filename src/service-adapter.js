export default class ServiceAdapter {
  constructor(service) {
    this.service = service;
  }

  fetchAll(...args) {
    return this.service.fetchAll(...args);
  }

  fetchOne(...args) {
    return this.service.fetchOne(...args);
  }

  createItem(...args) {
    return this.service.createItem(...args);
  }

  updateItem(...args) {
    return this.service.updateItem(...args);
  }

  deleteItem(...args) {
    return this.service.deleteItem(...args);
  }
}
