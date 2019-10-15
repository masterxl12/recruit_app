import React from 'react'
import ReactDOM from 'react-dom'
// import {Button} from 'antd-mobile'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Register from './containers/register'
import Login from './containers/login'
import Main from './containers/main'
import { Provider } from 'react-redux'
import store from './redux/store'
import './assets/css/index.less'
// import './test/socketio_test'
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path='/register' component={Register} />
                <Route path='/login' component={Login} />
                <Route path = '/' component={Main} />
            </Switch>
        </Router>
    </Provider>, document.getElementById('root'))