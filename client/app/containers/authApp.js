// Login/Register button functionality goes here
import React from 'react'
import {Modal, Tabs, Tab, Row, Input, Icon} from 'react-materialize'
import {signUp, resendEmailVerification, signIn} from '../server'
import LoginForm from '../components/loginForm'
import RegistrationForm from '../components/registrationForm'
import ResetPasswordForm from '../components/resetPasswordForm'
import { connect } from 'react-redux'
import { login } from '../actions'

const MENU = "MENU"
const LOGIN = "LOGIN"
const SUCCESS = "SUCCESS"
const FAILURE = "FAILURE"
const LOADING = "LOADING"
const REGISTER = "REGISTER"
const RESET_PASSWORD = "RESET_PASSWORD"
const PREVIOUS_VIEW = "PREVIOUS_VIEW"

class AuthTray extends React.Component {
  constructor(props, context) {
    super(props)
    this.state = {
      view: MENU,
      previous_view: null,
      serverMsg: "",
      resCode: 0
    };
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
  handleLoginClick(email, password) {
    this.setState({ view: LOADING, previous_view: LOGIN })
    signIn(email, password, (success, res) => {
      if(success) {
        console.log(res)
        this.setState({ view: SUCCESS, serverMsg: res.msg, resCode: res.statusCode })
        this.props.onLoginClick(res)
      }
      else {
        this.setState({ view: FAILURE, serverMsg: res.msg, resCode: res.statusCode })
      }
    })
  }
  handleRegistrationClick(email, password) {
    this.setState({ view: LOADING, previous_view: REGISTER })
    signUp(email, password, (success, res) => {
      if(success) {
        this.setState({ view: SUCCESS, serverMsg: res.msg, resCode: res.statusCode })
      }
      else {
        this.setState({ view: FAILURE, serverMsg: res.msg, resCode: res.statusCode })
      }
    })
  }
  render() {
    var returnView = () => {
      var tab = <ul className="tabs">
        <li className="tab grey darken-4 col s6"><a name={LOGIN} onClick={(e) => this.handleView(e)}>Login</a></li>
        <li className="tab grey darken-4 col s6"><a name={REGISTER} onClick={(e) => this.handleView(e)}>Register</a></li>
      </ul>
      switch(this.state.view) {
        case MENU:
          return (
            <div>
              {tab}
              <p className="white-text center">Please select one of the above</p>
            </div>
          )
        case LOGIN:
          return (
            <div>
              {tab}
              <LoginForm handleClick={(email, password) => this.handleLoginClick(email, password)}/>
              <p className="grey-text form-extra">Didnt receive a verification link? Click <a onClick={(e) => this.handleMode(e,5)}>here</a></p>
            </div>
          )
        case REGISTER:
          return (
            <div>
              {tab}
              <RegistrationForm handleClick={(email, password) => this.handleRegistrationClick(email, password)}/>
              <p className="grey-text form-extra">Didnt receive a verification link? Click <a onClick={(e) => this.handleMode(e,5)}>here</a></p>
            </div>
          )
        case LOADING:
          return (
            <div className="loader">
              <div className="sk-chasing-dots">
                <div className="sk-child sk-dot1 blue"></div>
                <div className="sk-child sk-dot2 blue"></div>
              </div>
              <h5 className="center grey-text animated infinite pulse">contacting server...</h5>
            </div>
          )
        case SUCCESS:
          return (
            <div className="green darken-2 alert">
              <h5 className="center white-text">{this.state.resCode}</h5>
              <p className="center white-text">{this.state.serverMsg}</p>
            </div>
          )
        case FAILURE:
          return (
            <div className="red darken-2 alert">
              <h5 className="center white-text">{this.state.resCode}</h5>
              <p className="center white-text">{this.state.serverMsg}</p>
              <a name={PREVIOUS_VIEW} onClick={(e) => this.handleView(e)} className="waves-effect waves-light btn red center try-again">try again</a>
            </div>
          )
        default:
          return
      }
    }
    //resend verification link
    /*
    else if(this.state.mode == 5){
      formContent = <div>
        <h5 className="blue-text center">Resend Verification Link</h5>
        <ResetPasswordForm />
      </div>;
    } */
    return (
      <ul className="right nav-right">
        <Modal
        header={<span className="white-text">UNI<span className="blue-text">LOL</span></span>}
        trigger={
          <div>
            <li><a className="waves-effect waves-light">Login</a></li>
            <li><a className="waves-effect waves-light">Register</a></li>
          </div>
        }>
          <div className='grey darken-4'>
            {returnView()}
          </div>
        </Modal>
      </ul>
    )
  }
}

const MAP_STATE_TO_PROPS = (state, ownProps) => {
  return {}
}

const MAP_DISPATCH_TO_PROPS = (dispatch, ownProps) => {
  return {
    onLoginClick: (res) => {
      dispatch(login(res))
    }
  }
}

const AuthApp = connect(MAP_STATE_TO_PROPS, MAP_DISPATCH_TO_PROPS)(AuthTray)
export default AuthApp
