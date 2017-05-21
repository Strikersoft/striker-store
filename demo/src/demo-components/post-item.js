import React from 'react';
import { shape, func, number, bool, string } from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import Status from './indicators';

const PostItem = observer(({ post, withDetails, withReloading }) => (
  <div>
    {post.title}
    {withReloading && <button onClick={post.reload}>Reload</button>}
    {post.isReloading ? <Status indicator={post.isReloading} type="Reloading..." /> : null}
    {post.isError ? <Status indicator={post.isError} type="Error..." /> : null}
    {withDetails && <Link to={`/examples/posts/${post.id}`}>Go to details</Link>}
  </div>
));

PostItem.propTypes = {
  post: shape({
    isReloading: shape({
      get: func,
      set: func
    }),
    isError: shape({
      get: func,
      set: func
    }),
    id: number,
    title: string
  }).isRequired,
  withDetails: bool,
  withReloading: bool
};

PostItem.defaultProps = {
  withDetails: true,
  withReloading: true
};

PostItem.displayName = 'PostItem';

export default PostItem;
