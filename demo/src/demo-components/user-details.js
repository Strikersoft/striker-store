import React from 'react';
import { shape, func, string, number } from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

const UserDetails = observer(({ user }) => (
  <div>
    userId: {user.id}
    <br />
    userName: {user.name}
    <br />
    isReloading: {user.isReloading.get().toString()}
    <br />
    isError: {user.isError.get().toString()}
    <br />
    <Link to={`/examples/crud/users/${user.id}/edit`} >Go to edit</Link>
  </div>
));

UserDetails.propTypes = {
  user: shape({
    isReloading: shape({
      get: func,
      set: func
    }),
    isError: shape({
      get: func,
      set: func
    }),
    id: number,
    name: string
  }).isRequired
};

UserDetails.displayName = 'UserDetails';

export default UserDetails;
