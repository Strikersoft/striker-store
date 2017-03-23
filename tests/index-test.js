import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import { FetchingBasicExample } from '../demo/src/demo-containers/fetching-basic'

describe('FetchingBasicExample tests', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('renders demo app', () => {
    render(<FetchingBasicExample />, node, () => {
      expect(node.innerHTML).toExist();
    })
  })
})
