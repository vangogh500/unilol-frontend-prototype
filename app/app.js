import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

var App = React.createClass({
  render() {
    return (
      <div>
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">UniLoL</span>
            <div className="mdl-layout-spacer"></div>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
              <label className="mdl-button mdl-js-button mdl-button--icon"
                     htmlFor="waterfall-exp">
                <i className="material-icons">search</i>
              </label>
              <div className="mdl-textfield__expandable-holder">
                <div>
                  <input className="mdl-textfield__input" type="text" name="sample"
                         id="waterfall-exp" />
                  <input className="mdl-textfield__input" type="text" name="sample"
                          id="waterfall-exp" />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    )
  }
})

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
  </Router>
), document.getElementById('app'))
