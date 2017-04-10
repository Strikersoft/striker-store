// import Mimic from 'mimic';
import React from 'react';
import { render } from 'react-dom';
import DevTools, { setUpdatesEnabled } from 'mobx-react-devtools';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import FetchingBasicExample from './demo-containers/fetching-basic';
import FetchingAdvancedExample from './demo-containers/fetching-advanced';
import CrudExample from './demo-containers/crud-example';

// Mimic.mockRequest('users-list', {
//   method: 'get',
//   url: '*/users',
//   response: {
//     status: 200,
//     delay: 1000,
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify([{ id: 1, name: 'swagggy' }])
//   }
// });

setUpdatesEnabled(true);

const Home = () => <h1>Demos of striker-mobx-store</h1>;

const DemoApp = () => (
  <div>
    <DevTools />
    <Router>
      <div>
        <Home />

        <ul>
          <li><Link to="/examples/fetch-basic" >Fetching Basic</Link></li>
          <li><Link to="/examples/fetch-advanced" >Fetching Advanced</Link></li>
          <li><Link to="/examples/crud" >CRUD</Link></li>
        </ul>

        <Route path="/examples/fetch-basic" component={FetchingBasicExample} />
        <Route path="/examples/fetch-advanced" component={FetchingAdvancedExample} />
        <Route path="/examples/crud" component={CrudExample} />

      </div>
    </Router>
  </div>
);

render(
  <DemoApp />,
  document.querySelector('#demo')
);
