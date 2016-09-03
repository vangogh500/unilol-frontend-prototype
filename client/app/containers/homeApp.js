import React from 'react'
import { connect } from 'react-redux'
import { getSchool } from '../server'

import Leaderboard from '../components/leaderboard'
import School from '../components/school'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    if(this.props.user) {
      return(
        <div></div>
      )
    }
    else {
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

const HomeApp = connect(MAP_STATE_TO_PROPS, MAP_DISPATCH_TO_PROPS)(Home)
export default HomeApp
