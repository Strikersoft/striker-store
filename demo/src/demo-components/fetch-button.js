import React from 'react';
import { func, shape } from 'prop-types';
import { observer } from 'mobx-react';

const FetchButton = ({ onClick, isEmpty }) => (
  <button onClick={onClick}>
    {isEmpty.get() ? 'Fetch initially' : 'Refetch all'}
  </button>
);

FetchButton.propTypes = {
  onClick: func.isRequired,
  isEmpty: shape({
    get: func.isRequired  // mobx boxed values: https://mobx.js.org/refguide/boxed.html
  }).isRequired
};

export default observer(FetchButton);
