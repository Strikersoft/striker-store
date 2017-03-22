import React, { Component } from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import DevTools, { setUpdatesEnabled } from 'mobx-react-devtools';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

setUpdatesEnabled(true);

import { FetchingBasicExample } from './demo-containers/fetching-basic';
import { FetchingAdvancedExample } from './demo-containers/fetching-advanced';
import { CrudExample } from './demo-containers/crud-example';

const Home = () => <h1>Demos of striker-mobx-store</h1>;

class DemoApp extends Component {
  render() {
    return (
      <div>
        <DevTools />
        <Router>
          <div>
            <Home />

            <ul>
              <li><Link to="/examples/fetch-basic" >Fetching Basic</Link></li>
              <li><Link to="/examples/fetch-advanced" >Fetching Advanced</Link></li>
              <li><Link to="/examples/crud" >CRUDw</Link></li>
            </ul>

            <Route path="/examples/fetch-basic" component={FetchingBasicExample} />
            <Route path="/examples/fetch-advanced" component={FetchingAdvancedExample} />
            <Route path="/examples/crud" component={CrudExample} />

          </div>
        </Router>
      </div>
    );
  }
}

render(
  <DemoApp />,
  document.querySelector('#demo')
);
