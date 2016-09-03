import React from 'react'
import { Link } from 'react-router'

import { sortRosterByLP } from '../util'
import CountDownTimer from './countdowntimer'

export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props)
    var date = new Date(this.props.lastUpdate)
    date.setDate(date.getDate() + 2)
    var totalSecs = Math.floor((date.getTime() - Date.now())/1000)

    var hours = Math.floor(totalSecs / 3600)
    var remaining = totalSecs % 3600
    var minutes = Math.floor(remaining / 60)
    var seconds = remaining % 60

    this.state = {
      roster: sortRosterByLP(this.props.roster),
      col1: "Summoner",
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
    console.log(this.state)
  }
  toggleCol1(e) {
    e.preventDefault()
    if(this.state.col1 == "Summoner") {
      this.setState({ col1: "Name" })
      this.props.toggleName("Name")
    }
    else {
      this.setState({ col1: "Summoner"})
      this.props.toggleName("Summoner")
    }
  }
  render() {
    return (
      <div>
        <ul className="collection">
          <li className="collection-item key">
            <div className="row">
              <div className="col s3 offset-s1">
                <span className="pointer" onClick={(e) => this.toggleCol1(e)}>{this.state.col1}</span>
              </div>
              <div className="col s3">
                Tier
              </div>
              <div className="col s2">
                LP
              </div>
              <div className="col s2">
                Win Ratio
              </div>
            </div>
          </li>
          {
            this.state.roster.map((user, i) => {
              return (
                <li className="collection-item grey lighten-4" key={user._id}>
                  <div className="row">
                    <div className="col s1 height-40">
                      <span>{i+1}</span>
                    </div>
                    <div className="col s3">
                      <Link to={(this.props.user._id == user._id) ? "profile" : "user/" + user._id}>
                        <span><img className="verticle-align-middle margin-right-5 circle" height="40px" src={"http://ddragon.leagueoflegends.com/cdn/6.17.1/img/profileicon/" + user._summoner.profileIconId + ".png"} /></span>
                        <span className="black-text">{(this.state.col1 == "Summoner") ? user._summoner.name : user.profile.firstName + " " + user.profile.lastName}</span>
                      </Link>
                    </div>
                    <div className="col s3 height-40">
                      <span className="grey-text">{user._summoner.rankedStats.soloQ.tier[0] + user._summoner.rankedStats.soloQ.tier.substr(1).toLowerCase() + " " + user._summoner.rankedStats.soloQ.division}</span>
                    </div>
                    <div className="col s2 height-40">
                      <span className="grey-text">{ user._summoner.rankedStats.soloQ.leaguePoints }</span>
                    </div>
                    <div className="col s2 height-40">
                      <span className="green-text">{user._summoner.rankedStats.soloQ.entry.wins}</span><span>/</span><span className="red-text">{user._summoner.rankedStats.soloQ.entry.losses}</span>
                    </div>
                  </div>
                </li>
              )
            })
          }
        </ul>
        <div className="float-right margin-right-5">
          <span className="grey-text margin-right-5">Time till next promotional update:</span>
          <CountDownTimer className="float-right text-bold" timer={{seconds: this.state.seconds, minutes: this.state.minutes, hours: this.state.hours}} />
        </div>
      </div>
    )
  }
}
