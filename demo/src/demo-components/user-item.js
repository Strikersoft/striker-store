import React from 'react';
import { shape, func, number, bool } from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import Status from './indicators';

const UserItem = observer(({ user, withDetails, withReloading, withDelete }) => (
  <div>
    {user.name}
    {withReloading && <button onClick={user.reload}>Reload</button>}
    {withDelete && <button onClick={user.delete}>Delete</button>}
    {user.isReloading ? <Status indicator={user.isReloading} type="Reloading..." /> : null}
    {user.isError ? <Status indicator={user.isError} type="Error..." /> : null}
    {withDetails && <Link to={`/examples/crud/users/${user.id}`}>Go to details</Link>}
  </div>
));

UserItem.propTypes = {
  user: shape({
    isReloading: shape({
      get: func,
      set: func
    }),
    isError: shape({
      get: func,
      set: func
    }),
    id: number
  }).isRequired,
  withDetails: bool,
  withReloading: bool,
  withDelete: bool
};

UserItem.defaultProps = {
  withDetails: true,
  withReloading: false,
  withDelete: false
};

UserItem.displayName = 'UserItem';

export default UserItem;
