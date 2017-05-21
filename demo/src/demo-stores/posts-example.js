import { serializable, identifier, list, object } from 'serializr';
import { observable } from 'mobx';
import { BaseDomainStore, DomainModel } from '../../../src';

class ExamplePostCommentModel {
  @serializable(identifier()) id;
  @serializable postId;
  @serializable body;
  @serializable name;
}

class ExamplePostModel extends DomainModel {
  @serializable(identifier()) id;
  @serializable title;
  @observable @serializable(list(object(ExamplePostCommentModel))) comments = [];
}

class ExamplePostCommentService {
  fetchAll(id) {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then(response => response.json());
  }
}

class ExamplePostService {
  fetchAll() {
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json());
  }

  fetchOne(id) {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(response => response.json());
  }
}

class ExamplePostStore extends BaseDomainStore {
  static service = new ExamplePostService();
  static modelSchema = ExamplePostModel;

  async storeDidFetchOne({ response, stores }) {
    const comments = await stores.comments.fetchAll(response.id);
    response.comments = comments;

    return response;
  }
}

class ExamplePostCommentStore extends BaseDomainStore {
  static service = new ExamplePostCommentService();
  static modelSchema = ExamplePostCommentModel;

  static storeName() {
    return 'comments';
  }
}

const post = new ExamplePostStore();
const comment = new ExamplePostCommentStore();

export { post, comment };
