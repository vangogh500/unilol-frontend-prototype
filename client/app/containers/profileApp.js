import React from 'react'
import ProfileSetupApp from './profileSetupApp'
import { hashHistory } from 'react-router'
import { connect } from 'react-redux'
import TrophyCase from '../components/trophyCase'

class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
    if(!props.user || !props.token) {
      alert("Uh oh. Something went wrong. Please try logging in again.")
      hashHistory.push('/')
    }
  }
  render() {
    var getRankColor = (rankedStats) => {
      if(rankedStats && rankedStats.soloQ) {
        switch(rankedStats.soloQ.tier) {
          case "PLATINUM":
            return "teal lighten-1"
          default:
            return ""
        }
      }
      else {
        return ""
      }
    }
    var getRank = (rankedStats) => {
      if(rankedStats && rankedStats.soloQ) {
        return rankedStats.soloQ.tier
      }
      else {
        return "UNRANKED"
      }
    }
    var returnView = (user) => {
      if(user.profile && this.props.summoner) {
        return (
          <div className="profile">
            <div className="row">
              <div className="col s8 offset-s1">
                <div className="row profile-left-top">
                  <img className={getRankColor(this.props.summoner.rankedStats) + " float-left z-depth-2"} id="profileIcon" src={"http://ddragon.leagueoflegends.com/cdn/6.17.1/img/profileicon/" + this.props.summoner.profileIconId + ".png"} />
                  <div className="vertically-aligned">
                    <h5 className="summoner-name float-left">{this.props.summoner.name}</h5>
                    <span className="new badge">{getRank(this.props.summoner.rankedStats)}</span>
                  </div>
                  <span className="grey-text block">{user.profile.firstName + " " + user.profile.lastName}</span>
                  <span className="grey-text block">{user.profile.major + " " + user.profile.graduationYear}</span>
                  <span className="blue-text block">{user.email}</span>
                </div>
                <div className="row">
                  <div className="center">
                    <h3 className="green-text inline">{this.props.summoner.rankedStats.soloQ.entry.wins}</h3><h3 className="inline">/</h3><h3 className="red-text inline">{this.props.summoner.rankedStats.soloQ.entry.losses}</h3>
                  </div>
                </div>
              </div>
              <div className="col s2">
                <p className="teal lighten-1 white-text school z-depth-1">University of Massachussetts Amherst</p>
                <div className="section">
                  <h6>Teams</h6>
                </div>
                <div className="section">
                  <TrophyCase />
                </div>
                <div className="section">
                  <h6>Smurfs</h6>
                </div>
              </div>
            </div>

          </div>
        )
      }
      else {
        return (
          <ProfileSetupApp />
        )
      }
    }
    return (
      <div className="grey lighten-3 content">
        <div className="main wide">
          {returnView(this.props.user)}
        </div>
      </div>
    )
  }
}

const MAP_STATE_TO_PROPS = (state, ownProps) => {
  return {
    user: state.user,
    token: state.token,
    summoner: state.summoner
  }
}

const MAP_DISPATCH_TO_PROPS = (dispatch, ownProps) => {
  return {
  }
}

const ProfileApp = connect(MAP_STATE_TO_PROPS, MAP_DISPATCH_TO_PROPS)(ProfilePage)
export default ProfileApp
