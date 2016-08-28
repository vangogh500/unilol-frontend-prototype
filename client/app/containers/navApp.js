import React from 'react'
import AuthApp from './authApp'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { logout } from '../actions'



class NavBar extends React.Component {
  render() {
    var returnRightNav = (user) => {
      console.log(user)
      if(user) {
        return (
          <ul className="right nav-right">
            <div>
              <li className="input-field main-search">
                <input id="search" type="search" required />
                <label htmlFor="search"><i className="material-icons float-left">search</i><span className="search_label">Search University..</span></label>
              </li>
              <li><Link to='/profile' className="waves-effect waves-light"><span><i className="tiny material-icons float-left">perm_identity</i>Vangogh</span></Link></li>
              <li><a onClick={(e) => this.props.onLogoutClick(e)} className="waves-effect waves-light">Logout</a></li>

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
  console.log(state)
  return {
    user: state.user
  }
}

const MAP_DISPATCH_TO_PROPS = (dispatch, ownProps) => {
  return {
    onLogoutClick: (e) => {
      e.preventDefault()
      dispatch(logout())
    }
  }
}

const NavApp = connect(MAP_STATE_TO_PROPS, MAP_DISPATCH_TO_PROPS)(NavBar)
export default NavApp
