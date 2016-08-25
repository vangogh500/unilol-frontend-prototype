import React from 'react';
import {hideElement} from '../util';

/**
 * A yellow error banner that uses Bootstrap's "warning" alert. Used to display HTTP request failures.
 */
export default class ErrorBanner extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // Don't display the error banner unless 'this.state.active' is true.
    return (
      <div className={"card red darken-1 "} role="alert">
        <div className="card-content white-text">
          {this.props.children}<br />
          Please <a onClick={() => window.location.reload()}>refresh the web page</a> and try again.
        </div>
      </div>
    )
  }
}
