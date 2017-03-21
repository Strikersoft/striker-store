import React, { Component } from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import DevTools, { setUpdatesEnabled } from 'mobx-react-devtools';

setUpdatesEnabled(true);

import { FetchingBasicExample } from './demo-containers/fetching-basic';
import { FetchingAdvancedExample } from './demo-containers/fetching-advanced';

class DemoApp extends Component {
  render() {
    return (
      <div>
        <h1>Demos of striker-mobx-store</h1>
        <DevTools />

        <div>
          <FetchingBasicExample />
        </div>
        <div>
          <FetchingAdvancedExample />
        </div>
      </div>
    );
  }
}

render(
  <DemoApp />,
  document.querySelector('#demo')
);
