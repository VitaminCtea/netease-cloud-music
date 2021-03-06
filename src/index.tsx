import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/App'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import * as serviceWorker from './serviceWorker'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'
import rootReducer from 'reducers/index'

import './style/style.css'
import './index.css'

export type Dispatch = typeof store.dispatch
export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware, logger))
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
