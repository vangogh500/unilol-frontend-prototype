import React from 'react'
import AuthApp from './authApp'
import { connect } from 'react-redux'

class NavBar extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    var returnRightNav = (isLoggedIn) => {
      if(isLoggedIn) {
        return (
          <ul className="right nav-right">
            <div>
              <li><a className="waves-effect waves-light">Profile</a></li>
              <li><a className="waves-effect waves-light">Logout</a></li>
            </div>
          </ul>
        )
      }
      else {
        return (
          <AuthApp />
        )
      }
    }
    return(
      <nav className="grey darken-4 animated bounceInDown">
        <div className="nav-wrapper">
          <div className="container">
            <a href="#" className="brand-logo waves-effect waves-light">UNI<span className="blue-text">LOL</span></a>
            {returnRightNav(this.props.user)}
          </div>
        </div>
      </nav>
    )
  }
}

const MAP_STATE_TO_PROPS = (state, ownProps) => {
  return {
    user: state.user
  }
}

const MAP_DISPATCH_TO_PROPS = (dispatch, ownProps) => {
  return {
  }
}

const NavApp = connect(MAP_STATE_TO_PROPS, MAP_DISPATCH_TO_PROPS)(NavBar)
export default NavApp
