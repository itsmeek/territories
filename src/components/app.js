import React, { Component } from 'react'
import { Container } from 'react-grid-system'
import { Route } from 'react-router-dom'

import Home from './home'

class App extends Component {
  render() {
    return (
      <div>
        <div>Impekable.com</div>
        <Container>
          <Route exact path="/" component={Home} />
        </Container>
      </div>
    )
  }
}

export default App
