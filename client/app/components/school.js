import React from 'react'
import { connect } from 'react-redux'
import { getSchool } from '../server'
import { Link } from 'react-router'

import Leaderboard from './leaderboard'
import AdminWidget from './adminWidget'
import EventListing from './eventListing'

const LEADERBOARD = "LEADERBOARD"
const EVENTS = "EVENTS"


class School extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      view: (this.props.location.pathname.toLowerCase().includes('events')) ? EVENTS : LEADERBOARD,
      serverMsg: "",
      resCode: 0,
      displayType: "Summoner",
      school: null
    }
  }
  handleView(e, view) {
    e.preventDefault()
    this.setState({ view: view })
  }
  componentDidMount() {
    getSchool(this.props.params.id, (success, res) => {
      if(success) {
        this.setState({ loading: false, school: res.school})
      }
      else {
        this.setState({ loading: false, error: true, resCode: res.statusCode, serverMsg: res.msg})
      }
    })
  }
  toggleName(option) {
    console.log(option)
    this.setState({ displayType: option})
  }
  render() {
    if(!this.state.loading) {
      if(!this.state.error) {
        return (
          <div>
            <div className="school-banner">
              <div className="row height-100">
              <div className="col s8 offset-s1 height-100">
                <div className="table height-100">
                  <h5 className="verticle-align-middle table-cell">
                    <img className="verticle-align-middle school-logo" src={this.state.school.logoUrl} height="100px" />
                    <span className="white-text flow-text">{this.state.school.name}</span>
                  </h5>
                </div>
              </div>
              </div>
            </div>
            <div className="grey lighten-3">
              <div className="main wide">
                <div className="row">
                  <div className="col s8 offset-s1">
                    <ul className="pagination">
                      <li className={"pointer " + ((this.state.view == LEADERBOARD) ? "active" : "")} onClick={(e) => this.handleView(e,LEADERBOARD)}><Link to={"school/" + this.props.params.id}>Leaderboard</Link></li>
                      <li className={"pointer " + ((this.state.view == EVENTS) ? "active" : "")} onClick={(e) => this.handleView(e,EVENTS)}><Link to={"school/" + this.props.params.id + "/events"}>Events</Link></li>
                    </ul>
                    {
                      React.cloneElement(this.props.children, { roster: this.state.school.roster, lastUpdate: this.state.school.lastUpdate, events: this.state.school.events, user: this.props.user, token: this.props.token })
                    }
                  </div>
                  <div className="col s2">
                    <AdminWidget admins={this.state.school.admins} roster={this.state.school.roster} displayType={this.state.displayType}/>
                    <div className="section">
                      <h6>Docs</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className="red darken-2 alert wide main">
            <div className="verticle-align-middle table-cell">
              <h5 className="center white-text">{this.state.resCode}</h5>
              <p className="center white-text">{this.state.serverMsg}</p>
            </div>
          </div>
        )
      }
    }
    else {
      return (
        <div className="grey lighten-3">
          <div className="main wide">
            <div className="loader verticle-align-middle table-cell">
              <div className="sk-chasing-dots">
                <div className="sk-child sk-dot1 blue"></div>
                <div className="sk-child sk-dot2 blue"></div>
              </div>
              <h5 className="center grey-text animated infinite pulse">contacting server...</h5>
            </div>
          </div>
        </div>
      )
    }
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

const SchoolApp = connect(MAP_STATE_TO_PROPS, MAP_DISPATCH_TO_PROPS)(School)
export default SchoolApp
