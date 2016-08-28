import React from 'react';
import {verifyEmail} from '../server';
import ErrorBanner from './errorBanner'

export default class EmailVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      success: false,
      serverMsg: "",
      statusCode: 0
    };
  }
  componentDidMount() {
    verifyEmail(this.props.params.token, (result, res) => {
      if(result) {
        this.setState({loaded: true, success: true})
      }
      else {
        this.setState({loaded: true, success: false, serverMsg: res.msg, statusCode: res.statusCode})
      }
    })
  }
  render() {
    var content = {};
    if(this.state.loaded) {
      console.log('test');
      if(this.state.success) {
        content = <div className="container content margin-top-80">
          <div className="green darken-1 alert">
            <div className="card-content white-text">
              <p>Success! Your email has been verified. Please login with the login information you provided.</p>
            </div>
          </div>
        </div>;
      }
      else {
        content = <div className="container content margin-top-80">
          <div className="red darken-2 alert">
            <h5 className="center white-text">{this.state.statusCode}</h5>
            <p className="center white-text">{this.state.serverMsg}</p>
          </div>
        </div>;
      }
    }
    else {
      content = <div className="container content margin-top-80">
        <h6 className="center white-text">Verifying...</h6>
        <div className="sk-chasing-dots">
          <div className="sk-child sk-dot1 blue"></div>
          <div className="sk-child sk-dot2 blue"></div>
        </div>
      </div>;
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}
