import React from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import ProfileSetupForm from '../components/profileSetupForm'
import SummonerSetupForm from '../components/summonerSetupForm'
import { updateProfile, registerSummoner, verifySummoner } from '../server'
import { updateUser } from '../actions'

/*
 * Views for the ProfileApp
 */
const WELCOME = "WELCOME"
const PROFILE_SETUP = "PROFILE_SETUP"
const SUMMONER_SETUP = "SUMMONER_SETUP"
const VERIFY_SUMMONER = "VERIFY_SUMMONER"
const PROFILE = "PROFILE"
const LOADING = "LOADING"
const SUCCESS = "SUCCESS"
const FAILURE = "FAILURE"
const PREVIOUS_VIEW = "PREVIOUS_VIEW"

class Profile extends React.Component {
  constructor(props) {
    super(props)
    if(!props.user) {
      alert("Uh oh. Something went wrong. Please try logging in again.")
      hashHistory.push('/')
    }
    this.state = {
      view: (!props.user.profile) ? WELCOME : (!props.user.ign) ? SUMMONER_SETUP : PROFILE,
      previous_view: null,
      serverMsg: "",
      resCode: 0,
      verificationToken: 0,
      summonerName: ""
    }
  }
  handleView(e, view) {
    e.preventDefault()
    if(e.target.name == PREVIOUS_VIEW) {
      this.setState({ view: this.state.previous_view, previous_view: null})
    }
    else {
      this.setState({ view: e.target.name })
    }
  }
  onProfileSetupClick(profile) {
    this.setState({ view: LOADING, previous_view: PROFILE_SETUP })
    updateProfile({ email: this.props.user.email, profile: profile }, (success, res) => {
      if(success) {
        updateUser(res)
        this.setState({ view: SUMMONER_SETUP })
      }
      else {
        this.setState({ view: FAILURE, serverMsg: res.msg, resCode: res.statusCode })
      }
    }, this.props.token)
  }
  onSummonerSetupClick(summonerName) {
    this.setState({ view: LOADING, previous_view: SUMMONER_SETUP })
    registerSummoner(summonerName, (success, res) => {
      if(success) {
        console.log(res)
        this.setState({ view: VERIFY_SUMMONER, verificationToken: res.verificationToken, summonerName: res.summonerName })
      }
      else {
        this.setState({ view: FAILURE, serverMsg: res.msg, resCode: res.statusCode })
      }
    }, this.props.token)
  }
  onVerifySummonerClick(e) {
    e.preventDefault()
    this.setState({ view: LOADING, previous_view: VERIFY_SUMMONER })
    verifySummoner(this.state.summonerName, (success, res) => {
      if(success) {
        console.log(res)
        this.setState({ view: PROFILE })
      }
      else {
        this.setState({ view: FAILURE, serverMsg: res.msg, resCode: res.statusCode })
      }
    })
  }
  render() {
    var returnView = () => {
      switch(this.state.view) {
        case WELCOME:
          return (
            <div className="setup">
              <div className="content">
                <h3 className="center animated fadeIn flow-text">WELCOME to</h3>
                <h1 className="center animated fadeIn">UNI<span className="animated fadeIn blue-text">LOL</span></h1>
                <a name={PROFILE_SETUP} onClick={(e) => this.handleView(e)} className="center animated bounceIn btn waves-effect waves-light blue">continue...</a>
              </div>
            </div>
          )
        case PROFILE_SETUP:
          return (
            <div className="setup">
              <div className="content">
                <h1 className="center flow-text">Lets get started.</h1>
                <ProfileSetupForm handleClick={(profile) => this.onProfileSetupClick(profile)} />
              </div>
            </div>
          )
        case LOADING:
          return (
            <div className="setup">
              <div className="content">
                <div className="loader">
                  <div className="sk-chasing-dots">
                    <div className="sk-child sk-dot1 blue"></div>
                    <div className="sk-child sk-dot2 blue"></div>
                  </div>
                  <h5 className="center grey-text text-darken-1 animated infinite pulse">contacting server...</h5>
                </div>
              </div>
            </div>
          )
        case FAILURE:
          return (
            <div className="setup">
              <div className="content">
                <div className="red darken-2 alert">
                  <h5 className="center white-text">{this.state.resCode}</h5>
                  <p className="center white-text">{this.state.serverMsg}</p>
                  <a name={PREVIOUS_VIEW} onClick={(e) => this.handleView(e)} className="waves-effect waves-light btn red center try-again">try again</a>
                </div>
              </div>
            </div>
            )
        case SUMMONER_SETUP:
          return (
            <div className="setup">
              <div className="content">
                <h4 className="center">Connect your account with your league of legends account.</h4>
                <p>The account supplied should be your main League of Legends account as it will be used to rank you on your university ladder. Smurf accounts can always be added later.</p>
                <SummonerSetupForm handleClick={(summonerName) => this.onSummonerSetupClick(summonerName) } />
              </div>
            </div>
          )
        case VERIFY_SUMMONER:
          return (
            <div className="setup">
              <div className="content">
                <h4 className="center">Almost there...</h4>
                <p className="">All you need to do now is to verify your account by renaming one of your mastery pages on the summoner account <span className="blue-text">{this.state.summonerName}</span> to the code given below. Click the button below when you are ready to proceed.</p>
                <h5 className="red-text center">{this.state.verificationToken}</h5>
                <a className="btn waves-effect waves-light verify center" onClick={(e) => this.onVerifySummonerClick(e)}>Verify</a>
              </div>
            </div>
          )
        case PROFILE:
          return (
            <div className="setup">
              <div className="content">
                <p>TESTTTTT</p>
              </div>
            </div>
          )
      }
    }
    return (
      <div className="grey lighten-3 content">
        <div className="container main">
          {returnView()}
        </div>
      </div>
    )
  }
}

const MAP_STATE_TO_PROPS = (state, ownProps) => {
  return {
    user: state.user,
    token: state.token
  }
}

const MAP_DISPATCH_TO_PROPS = (dispatch, ownProps) => {
  return {
  }
}

const ProfileApp = connect(MAP_STATE_TO_PROPS, MAP_DISPATCH_TO_PROPS)(Profile)
export default ProfileApp