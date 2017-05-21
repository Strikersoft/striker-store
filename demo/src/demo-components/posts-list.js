import React from 'react';
import { shape, func, number, arrayOf } from 'prop-types';
import { observer } from 'mobx-react';

import Status from './indicators';
import PostItem from './post-item';

const PostList = observer(({ posts, isReloading, isLoading, ...rest }) => (
  <div>
    {posts.map(
      post => (
        <PostItem
          key={post.id}
          post={post}
          {...rest}
        />
      )
    )}
    {isReloading ? <Status indicator={isReloading} type="Reloading..." /> : null}
    {isLoading ? <Status indicator={isLoading} type="Loading..." /> : null}
  </div>
));

PostList.propTypes = {
  posts: arrayOf(
    shape({ id: number })
  ).isRequired,
  isReloading: shape({
    get: func,
    set: func
  }),
  isLoading: shape({
    get: func,
    set: func
  })
};

PostList.displayName = 'PostList';

export default PostList;
