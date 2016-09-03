import React from 'react'
import { Link } from 'react-router'

import { formatDate } from '../util'

export default class EventListing extends React.Component {
  render() {
    return (
      <ul className="collection">
      {
        this.props.events.map((event) => {
          return (
            <Link className="collection-item" key={event._id} to={"school/" + this.props.params.id + "/events/" + event._id}>
              <div className="row">
                <div className="col s6">
                  <span className="black-text margin-right-5">{event.name}</span>
                    {(() => {
                      if(event.official) {
                        return <span className="badge new">Official</span>
                      }
                      else {
                        return
                      }
                    })()}
                  <span className="block grey-text">{event.description}</span>
                </div>
                <div className="col s3 height-44">
                  <span className="grey-text font-size-12">{formatDate(event.posted, null)}</span>
                </div>
                <div className="col s3 height-44">
                  <span className="grey-text font-size-12 right">{formatDate(event.startDate, event.endDate)}</span>
                </div>
              </div>
            </Link>
          )
        })
      }
      </ul>
    )
  }
}
