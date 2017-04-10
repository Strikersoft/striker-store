import React from 'react';
import { shape, func, number, arrayOf } from 'prop-types';
import { observer } from 'mobx-react';

import Status from './indicators';
import UserItem from './user-item';

const UserList = observer(({ users, isReloading, isLoading, ...rest }) => (
  <div>
    {users.map(
      user => (
        <UserItem
          key={user.id}
          user={user}
          {...rest}
        />
      )
    )}
    {isReloading ? <Status indicator={isReloading} type="Reloading..." /> : null}
    {isLoading ? <Status indicator={isLoading} type="Loading..." /> : null}
  </div>
));

UserList.propTypes = {
  users: arrayOf(
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

UserList.displayName = 'UserList';

export default UserList;
