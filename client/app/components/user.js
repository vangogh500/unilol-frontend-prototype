import React from 'react'
import { Link } from 'react-router'

import TrophyCase from '../components/trophyCase'
import { getUser } from '../server'

export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      serverMsg: "",
      resCode: 0,
      user: null
    }
  }
  componentDidMount() {
    getUser(this.props.params.id, (success, res) => {
      if(success) {
        this.setState({ loading: false, user: res.user})
      }
      else {
        this.setState({ loading: false, error: true, resCode: res.statusCode, serverMsg: res.msg})
      }
    })
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
    if(!this.state.loading) {
      if(!this.state.error) {
        return (
          <div className="grey lighten-3 content">
            <div className="main wide">
              <div className="profile">
                <div className="row">
                  <div className="col s8 offset-s1">
                    <div className="row profile-left-top">
                      <img className={getRankColor(this.state.user._summoner.rankedStats) + " float-left z-depth-2"} id="profileIcon" src={"http://ddragon.leagueoflegends.com/cdn/6.17.1/img/profileicon/" + this.state.user._summoner.profileIconId + ".png"} />
                      <div className="vertically-aligned">
                        <h5 className="summoner-name float-left">{this.state.user._summoner.name}</h5>
                        <span className="new badge">{getRank(this.state.user._summoner.rankedStats)}</span>
                      </div>
                      <span className="grey-text block">{this.state.user.profile.firstName + " " + this.state.user.profile.lastName}</span>
                      <span className="grey-text block">{this.state.user.profile.major + " " + this.state.user.profile.graduationYear}</span>
                      <span className="blue-text block">{this.state.user.email}</span>
                    </div>
                    <div className="row">
                      <div className="center">
                        <h3 className="green-text inline">{this.state.user._summoner.rankedStats.soloQ.entry.wins}</h3><h3 className="inline">/</h3><h3 className="red-text inline">{this.state.user._summoner.rankedStats.soloQ.entry.losses}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col s2">
                    <Link className="waves-effect btn height-auto" to={"school/" + this.state.user.school._id}>
                      <p className="white-text school">University of Massachussetts Amherst</p>
                    </Link>
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
      console.log("loading")
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
