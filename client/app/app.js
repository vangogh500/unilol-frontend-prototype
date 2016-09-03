import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import NavApp from './containers/navApp'
import ProfileApp from './containers/profileApp'
import HomeApp from './containers/homeApp'

import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import unilol from './reducers'
import { Provider } from 'react-redux'
import { loginFromStorage } from './actions'

import EmailVerification from './components/emailVerification'
import School from './components/school'
import Leaderboard from './components/leaderboard'
import EventListing from './components/eventListing'
import Event from './components/event'
import User from './components/user'

var Footer =  React.createClass({
  render() {
    return (
      <footer className="page-footer grey darken-4">
        <div className="footer-copyright">
            <div className="container">
            © 2016 Copyright Kai Matsuda
            </div>
        </div>
      </footer>
    )
  }
})

class App extends React.Component {
  render() {
    return (
      <div>
        <NavApp />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

var store = applyMiddleware(thunk)(createStore)(unilol)

store.dispatch(loginFromStorage())

ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={HomeApp}/>
        <Route path="verifyEmail/:token" component={EmailVerification} />
        <Route path="profile" component={ProfileApp} />
        <Route path="school/:id" component={School}>
          <IndexRoute component={Leaderboard} />
          <Route path="events" component={EventListing} />
          <Route path="events/:eventId" component={Event} />
        </Route>
        <Route path="user/:id" component={User} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))
