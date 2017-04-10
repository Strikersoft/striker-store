import React from 'react';
import { shape, func, string } from 'prop-types';
import { observer } from 'mobx-react';

const IndicatorComponent = observer(({ indicator, type }) => {
  if (indicator.get()) {
    return <span>({type})</span>;
  }

  return null;
});

IndicatorComponent.propTypes = {
  indicator: shape({ get: func }).isRequired,
  type: string
};

IndicatorComponent.defaultProps = {
  type: 'Loading'
};

IndicatorComponent.displayName = 'StatusIndicator';

export default IndicatorComponent;
