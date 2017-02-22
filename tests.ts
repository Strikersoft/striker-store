import { createDomainStore, DomainService, DomainStoreConfig } from './lib/index';
import { serializable, createSimpleSchema, identifier } from 'serializr';

class Service implements DomainService {
    fetch() {
        return Promise.resolve([{ id: 1, name: 'swag'}]);
    }

    fetchOne() {
        return Promise.resolve({ id: 1, name: 'swag'});
    }
}

class User {
    @serializable(identifier()) id;
    @serializable name = '';
}

async function testReuseModels() {
    const { store, itemResolver, listResolver } = createDomainStore({
        name: 'users',
        serviceToInject: new Service(),
        domainModel: User
    });

    await store.fetchItemById(1);
    const a = store.getItem(1);

    await store.fetchItemById(1);
    const b = store.getItem(1);

    if (a !== b) {
        throw new Error('test failed');
    }
}

async function testListFetched() {
    const { store, itemResolver, listResolver } = createDomainStore({
        name: 'users',
        serviceToInject: new Service(),
        domainModel: User
    });

    await store.fetchItems();

    if (store.data.size === 0) {
        throw new Error('test failed');
    }
}

function testResolvers() {
    const { store, itemResolver, listResolver } = createDomainStore({
        name: 'users',
        serviceToInject: new Service(),
        domainModel: User
    });

    itemResolver({ params: { id: '1' }}, {}, () => {
        if (store.data.size === 0) {
            throw new Error('test failed');
        }
    });

    listResolver({ params: { id: '1' }}, {}, () => {
        if (store.data.size === 0) {
            throw new Error('test failed');
        }
    });
}

testReuseModels();
testListFetched();
testResolvers();