// Login/Register button functionality goes here
import React from 'react'
import {Modal, Tabs, Tab, Row, Input, Icon} from 'react-materialize'
import update from 'react-addons-update';
import {validateEmail, validateEdu, validatePassword} from '../util/validation';
import ErrorBanner from './errorBanner';
import {signup} from '../server';

export default class LoginTray extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 0 = opton, 1 = login, 2 = register
      mode: 0,
      login: {
        email: "",
        emailError: "This field is required.",
        password: "",
        passwordError: "This field is required."
      },
      register: {
        email: "",
        emailError: "This field is required.",
        conEmail: "",
        conEmailError: "",
        password: "",
        passwordError: "This field is required.",
        conPassword: "",
        conPasswordError: ""
      }
    };
  }
  handleChange(e, category, target) {
    e.preventDefault();
    var arg = {};
    arg[target] = {$set: e.target.value};
    var newSubState = update(this.state[category], arg);
    this.handleValidation(e.target.value, target, newSubState);
    var newState = {};
    newState[category] = newSubState;
    newState.pristine = false;
    this.setState(newState);
  }

  handleMode(e, mode) {
    if(e) e.preventDefault();
    this.state.mode = mode;
    this.setState(this.state);
  }

  handleValidation(value, target, state) {
    //if the validation is on an email
    if(target == 'email') {
      if(!value) {
        state.emailError = 'This field is required.';
      }
      else if(!validateEmail(value)) {
        state.emailError = 'Not a valid email address!';
      }
      else if(!validateEdu(value)) {
        state.emailError = "Your email does not belong to an edu domain!";
      }
      else {
        state.emailError = '';
      }
      if(value.toLowerCase() !== state.conEmail.toLowerCase()) {
        state.conEmailError = 'Does not match your email!';
      }
    }
    else if(target == 'conEmail') {
      if(value.toLowerCase() !== state.email.toLowerCase()) {
        state.conEmailError = 'Does not match your email!';
      }
      else {
        state.conEmailError = '';
      }
    }
    else if(target == 'password') {
      if(!value) {
        state.passwordError = 'This field is required.';
      }
      else if(!validatePassword(value)) {
        state.passwordError = 'Minimum 8 and Maximum 10 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, and 1 Number.';
      }
      else {
        state.passwordError = '';
      }
      if(value !== state.conPassword) {
        state.conPasswordError = 'Does not match your password!';
      }
    }
    else if(target == 'conPassword') {
      if(value == state.password) {
        state.conPasswordError = '';
      }
      else {
        state.conPasswordError = 'Does not match your password!';
      }
    }
  }

  handleServerResponse(success) {
    if(success) {
      this.handleMode(null,3);
    }
    else {
      this.handleMode(null,4);
    }
  }

  render() {
    var errorMsg = {};
    if(this.state.login.emailError) { errorMsg.loginEmailError = <div><p className="red-text errorMsg">{this.state.login.emailError}</p></div>; }
    if(this.state.login.passwordError) { errorMsg.loginPasswordError = <div><p className="red-text errorMsg">{this.state.login.passwordError}</p></div>; }
    if(this.state.register.emailError) { errorMsg.registerEmailError = <div><p className="red-text errorMsg">{this.state.register.emailError}</p></div>; }
    if(this.state.register.conEmailError) { errorMsg.registerConEmailError = <div><p className="red-text errorMsg2">{this.state.register.conEmailError}</p></div>; }
    if(this.state.register.passwordError) { errorMsg.registerPasswordError = <div><p className="red-text errorMsg">{this.state.register.passwordError}</p></div>; }
    if(this.state.register.conPasswordError) { errorMsg.registerConPasswordError = <div><p className="red-text errorMsg2">{this.state.register.conPasswordError}</p></div>; }
    var formContent = {};

    if(this.state.mode == 0) {
      formContent = <div>
        <ul className="tabs">
          <li className="tab grey darken-4 col s6"><a className="active" onClick={(e) => this.handleMode(e, 1)}>Login</a></li>
          <li className="tab grey darken-4 col s6"><a onClick={(e) => this.handleMode(e, 2)}>Register</a></li>
        </ul>
        <p className="white-text center">Please select one of the above</p>
      </div>;
    }
    else if(this.state.mode == 1) {
      formContent = <div>
        <ul className="tabs">
          <li className="tab grey darken-4 col s6"><a className="active" onClick={(e) => this.handleMode(e, 1)}>Login</a></li>
          <li className="tab grey darken-4 col s6"><a onClick={(e) => this.handleMode(e, 2)}>Register</a></li>
        </ul>
        <Row className="modalForm animated slideInRight">
          <Input s={12} className={"white-text " + (this.state.login.emailError ? "invalid" : "valid")} label="Email" value={this.state.login.email} onChange={(e) => this.handleChange(e, 'login', 'email')} type='email'><Icon>account_circle</Icon></Input>
          {errorMsg.loginEmailError}
          <Input s={12} type='password' className={"white-text " + (this.state.login.passwordError ? "invalid" : "valid")} label="Password" value={this.state.login.password} onChange={(e) => this.handleChange(e, 'login', 'password')}><Icon>lock</Icon></Input>
          {errorMsg.loginPasswordError}
          <button className={"btn waves-effect waves-light " + ((this.state.login.emailError || this.state.login.passwordError) ? "disabled" : "")} name="action" type="submit">Login<i className="material-icons right">send</i></button>
        </Row>
      </div>;
    }
    else if(this.state.mode == 2){
      formContent = <div>
        <ul className="tabs">
          <li className="tab grey darken-4 col s6"><a onClick={(e) => this.handleMode(e, 1)}>Login</a></li>
          <li className="tab grey darken-4 col s6"><a className="active" onClick={(e) => this.handleMode(e, 2)}>Register</a></li>
        </ul>
        <Row className="modalForm animated slideInRight">
          <Input s={12} className={"white-text " + (this.state.register.emailError ? "invalid" : "valid")} label="Email" value={this.state.register.email} onChange={(e) => this.handleChange(e, 'register', 'email')} type='email'><Icon>account_circle</Icon></Input>
          {errorMsg.registerEmailError}
          <Input s={12} label="Confirm Email" className={"white-text " + (this.state.register.conEmailError ? "invalid" : "valid")} value={this.state.register.conEmail} onChange={(e) => this.handleChange(e, 'register', 'conEmail')} type='email'/>
          {errorMsg.registerConEmailError}
          <Input s={12} type='password' className={"white-text " + (this.state.register.passwordError ? "invalid" : "valid")} label="Password" value={this.state.register.password} onChange={(e) => this.handleChange(e, 'register', 'password')}><Icon>lock</Icon></Input>
          {errorMsg.registerPasswordError}
          <Input s={12} label="Confirm Password" type='password' className={"white-text " + (this.state.register.conPasswordError ? "invalid" : "valid")} value={this.state.register.conPassword} onChange={(e) => this.handleChange(e, 'register', 'conPassword')}/>
          {errorMsg.registerConPasswordError}
          <button onClick={(e) => signup(this.state.register.email, this.state.register.password, (result) => this.handleServerResponse(result))} className={"btn waves-effect waves-light " + ((this.state.register.emailError || this.state.register.conEmailError || this.state.register.passwordError || this.state.register.conPasswordError) ? "disabled" : "")} name="action" type="submit">Register<i className="material-icons right">send</i></button>
        </Row>
      </div>;
    }
    else if(this.state.mode == 3){
      formContent = <div className="card green darken-1">
        <div className="card-content white-text">
          <p>Success! Please check the email you provided for a verification link.</p>
        </div>
        <button onClick={(e) => this.handleMode(e, 0)} className="btn waves-effect waves-light grey darken-1" type="submit" name="action">Back
          <i className="material-icons left">keyboard_arrow_left</i>
        </button>
      </div>;
    }
    else {
      formContent = <div>
        <ErrorBanner />
        <button onClick={(e) => this.handleMode(e, 0)} className="btn waves-effect waves-light grey darken-1" type="submit" name="action">Back
          <i className="material-icons left">keyboard_arrow_left</i>
        </button>
      </div>;
    }
    return (
      <div>
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
              {formContent}
            </div>
          </Modal>
        </ul>
      </div>
    )
  }
}
