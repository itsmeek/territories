import React, { Component } from 'react'
import { Container } from 'react-grid-system'
import { Route } from 'react-router-dom'

import Home from './home'
import Copy from './home/copy'

class App extends Component {
  render() {
    return (
      <div>
        <div>Impekable.com</div>
        <Container>
          <Route exact path="/" component={Home} />
          <Route path="/copy" component={Copy} />
        </Container>
      </div>
    )
  }
}

export default App
