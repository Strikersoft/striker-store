import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import { post } from '../demo-stores/posts-example';
import PostList from '../demo-components/posts-list';
import Status from '../demo-components/indicators';

import FetchAll from '../../../src/react/fetch-all';
import FetchOne from '../../../src/react/fetch-one';

const PostItem = observer(({ item, isReloading }) => (
  <div>
    <p>Post: {item.title}</p>
    {item.comments.map(comment => (
      <div key={comment.id}>
        comment from : {comment.name}
      </div>
    ))}
    <Status indicator={isReloading} type="Comments loading..." />
  </div>
));


const PostExample = () => (
  <div>
    <h2>Post example</h2>
    <Link to="/examples/posts">Home</Link>
    <Link to="/examples/posts/list">List</Link>

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Switch>
        <Route
          exact
          path="/examples/posts/list"
          render={() => (
            <FetchAll
              store={post}
              onlyOnInit
              whenLoading={() => <div>item is loading</div>}
              whenFulfilled={({ data, isReloading }) => <PostList posts={data} isReloading={isReloading} />}
              whenRejected={() => <div>error</div>}
            />
          )}
        />
        <Route
          exact
          path="/examples/posts/:id"
          render={({ match }) => (
            <FetchOne
              store={post}
              id={match.params.id}
              whenLoading={() => <div>post details is loading ...</div>}
              whenFulfilled={({ data, isReloading }) => <PostItem item={data} isReloading={isReloading} />}
              whenRejected={() => <div>error</div>}
            />
          )}
        />
      </Switch>
    </div>
  </div>
);

export default PostExample;
