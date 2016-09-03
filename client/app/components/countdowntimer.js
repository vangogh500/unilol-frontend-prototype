import React from 'react'

export default class CountDownTimer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      secondsRemaining: props.timer.seconds,
      minutesRemaining: props.timer.minutes,
      hoursRemaining: props.timer.hours
    }
  }
  tick() {
    if(this.state.secondsRemaining == 0) {
      if(this.state.minutesRemaining == 0) {
        if(this.state.hoursRemaining == 0) {
          clearInterval(this.interval)
        }
        else {
          this.setState({hoursRemaining: this.state.hoursRemaining - 1, minutesRemaining: 59, secondsRemaining: 59})
        }
      }
      else {
        this.setState({minutesRemaining: this.state.minutesRemaining - 1, secondsRemaining: 59})
      }
    }
    else {
      this.setState({secondsRemaining: this.state.secondsRemaining - 1})
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    return (
      <div className={this.props.className}>
        <span>{(this.state.hoursRemaining < 10) ? ("0" + this.state.hoursRemaining) : this.state.hoursRemaining}</span><span>:</span><span>{(this.state.minutesRemaining < 10) ? ("0" + this.state.minutesRemaining) : this.state.minutesRemaining}</span><span>:</span><span>{(this.state.secondsRemaining < 10) ? ("0" + this.state.secondsRemaining) : this.state.secondsRemaining}</span>
      </div>
    )
  }
}
