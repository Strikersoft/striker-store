import React, { Component } from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import DevTools, { setUpdatesEnabled } from 'mobx-react-devtools';

setUpdatesEnabled(true);

import { SimplestDemo } from './demo-containers/simplest';

class DemoApp extends Component {
  render() {
    return (
      <div>
        <h1>Demos of striker-mobx-store</h1>
        <DevTools />

        <div>
          <SimplestDemo />
        </div>
      </div>
    );
  }
}

render(
  <DemoApp />,
  document.querySelector('#demo')
);
