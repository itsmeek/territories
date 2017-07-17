import React from 'react'
import ReactDOM from 'react-dom'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Container } from 'react-grid-system'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import App from './components/app'
import reducers from './reducers'
import '../styles/style.css'


injectTapEventPlugin()

const createStoreWithMiddleWare = applyMiddleware(ReduxThunk)(createStore)
const store = createStoreWithMiddleWare(reducers)

// Override font of material ui to Open Sans
const fontFamily = "'Open Sans', sans-serif"
const muiTheme = getMuiTheme({ fontFamily })

// Router
const history = createBrowserHistory()

const Main = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Router history={history}>
        <Container>
          <App />
        </Container>
      </Router>
    </Provider>
  </MuiThemeProvider>
)

ReactDOM.render(<Main />, document.querySelector('.container'))
