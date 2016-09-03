import React from 'react'

export default class AdminWidget extends React.Component {
  render() {
    return (
      <div className="section">
        <h6>Admins</h6>
        <div className="white height-100 widget-container">
          {
            this.props.admins.map((user) => {
              var userObj = this.props.roster[this.props.roster.map(function(usr) { return usr._id}).indexOf(user._user)]
              return(
                <div key={user._user}>
                  <span className="new badge">{user.role}</span>
                  <span className="clear-both"> { (this.props.displayType == "Summoner") ? userObj._summoner.name : userObj.profile.firstName + " " + userObj.profile.lastName}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
