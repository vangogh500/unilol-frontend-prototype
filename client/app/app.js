import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import LoginTray from './components/logintray'
import {Navbar} from 'react-materialize'

var Navigation = React.createClass({
  render() {
    return(
      <nav className="grey darken-4 animated bounceInDown">
        <div className="nav-wrapper">
          <div className="container">
            <a href="#" className="brand-logo waves-effect waves-light">UNI<span className="blue-text">LOL</span></a>
            <LoginTray />
          </div>
        </div>
      </nav>
    )
  }
})

var Banner = React.createClass({
  render() {
    return(
      <div className="content banner-container">
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

var App = React.createClass({
  render() {
    return (
      <div>
        <Navigation />
        {this.props.children}
        <Footer />
      </div>
    )
  }
})

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Banner}/>
    </Route>
  </Router>
), document.getElementById('app'))
