import React from 'react'
import { Link } from 'react-router'

import { formatDate } from '../util'
import { rsvp } from '../server'
import Remarkable from 'remarkable'

var md = new Remarkable()

export default class Event extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      event: props.events.filter(function(event) { return event._id == props.params.eventId })[0]
    }
  }
  onRSVPClick(e) {
    e.preventDefault()
    rsvp(this.state.event._id, (success, res) => {
      if(success) {
        this.state.event.participants.push(this.props.user._id)
        this.setState( {event: this.state.event} )
        console.log(this.state.event)
      }
      else {

      }
    }, this.props.token)
  }
  render() {
    var createMarkup = () => {
      return {__html: md.render(this.state.event.text)}
    }
    console.log(createMarkup())
    return (
      <div className="margin-bottom-50">
        <div className="white event">
          <span className="grey-text">{formatDate(this.state.event.startDate, this.state.event.endDate)}</span>
          <h5>{this.state.event.name}</h5>
          <h6 className="grey-text margin-bottom-50">{this.state.event.description}</h6>
          <div className="grey-text text-darken-3 margin-bottom-50" dangerouslySetInnerHTML={createMarkup()} />
          <div className="margin-bottom-50">
            <span className="blue-text text-bold">Organizers:</span>
            <br />
            {
              this.state.event.organizers.map((user) => {
                console.log(this.props.roster.map(function(usr) { return usr._id}).indexOf(user))
                var userObj = this.props.roster[this.props.roster.map(function(usr) { return usr._id}).indexOf(user)]
                return(
                  <div key={user._user} className="chip margin-right-5">
                    <Link to={(this.props.user._id == user) ? "profile" : 'user/' + user}>
                      <img src={"http://ddragon.leagueoflegends.com/cdn/6.17.1/img/profileicon/" + userObj._summoner.profileIconId + ".png"} />
                      <span className="grey-text text-darken-3">{ (this.props.displayType == "Summoner") ? userObj._summoner.name : userObj.profile.firstName + " " + userObj.profile.lastName}</span>
                    </Link>
                  </div>
                )
              })
            }
          </div>
          <div>
            <span className="blue-text text-bold">Attending:</span>
            <table className="bordered links">
              <tbody>
                {
                  this.state.event.participants.map((user) => {
                    var userObj = this.props.roster[this.props.roster.map(function(usr) { return usr._id }).indexOf(user)]
                    return(
                      <tr>
                        <td className="grey-text text-darken-3"><Link to={'user/' + user} className="hover-grey"><img height="40px" className="verticle-align-middle margin-right-5" src={"http://ddragon.leagueoflegends.com/cdn/6.17.1/img/profileicon/" + userObj._summoner.profileIconId + ".png"} />{userObj._summoner.name}</Link></td>
                        <td className="grey-text text-darken-3"><Link to={'user/' + user} className="hover-grey"><span className="grey-text text-darken-3">{userObj.profile.firstName + " " + userObj.profile.lastName}</span></Link></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {
              (() => {
                if(!this.state.event.participants.includes(this.props.user._id)) {
                  return (
                    <a onClick={(e) => this.onRSVPClick(e)} className="btn center waves-effect grey lighten-2 black-text margin-bottom-50">RSVP</a>
                  )
                }
                else {
                  return (
                    <a className="btn center waves-effect red lighten-2 margin-bottom-50 margin-top-20">Cancel RSVP</a>
                  )
                }
              })()
            }
          </div>
        </div>
        <Link to={"school/" + this.props.params.id + "/events"} className="btn waves-effect block">Back</Link>
      </div>
    )
  }
}
