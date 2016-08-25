import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import NavApp from './containers/navApp'
import Profile from './components/profile'
import EmailVerification from './components/emailVerification'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import unilol from './reducers'
import { Provider } from 'react-redux'

var Banner = React.createClass({
  render() {
    return(
      <div className="banner-container">
        <img id="banner" className="center" src="img/banner.jpg" />
        <div className="row container searchbar">
          <form className="animated fadeInDown">
            <div id="search" className="input-field">
              <input placeholder="Search for your school now!"type="search" required />
              <label htmlfor="search"><i className="material-icons prefix">search</i></label>
              <i className="material-icons postfix">close</i>
            </div>
          </form>
        </div>
      </div>
    )
  }
})

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

console.log(store.getState())

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Banner}/>
        <Route path="verifyEmail/:token" component={EmailVerification} />
        <Route path="profile" component={Profile} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))
