// Login/Register button functionality goes here
import React from 'react'
import {Modal, Tabs, Tab, Row, Input, Icon} from 'react-materialize'
import update from 'react-addons-update';
import {validateEmail, validateEdu, validatePassword} from '../util/validation';

export default class LoginTray extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // false = login, true = register
      mode: false,
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
    console.log(newState);
    this.setState(newState);
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
      if(value !== state.conEmail) {
        state.conEmailError = 'Does not match your email!';
      }
    }
    else if(target == 'conEmail') {
      if(value !== state.email) {
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
      if(value !== state.password) {
        state.conPasswordError = 'Does not match your password!';
      }
      else {
        state.conEmailError = '';
      }
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
            <Tabs className='grey darken-4'>
              <Tab title="Login">
                <Row className="modalForm">
                  <Input s={12} className={"white-text " + (this.state.login.emailError ? "invalid" : "valid")} label="Email" value={this.state.login.email} onChange={(e) => this.handleChange(e, 'login', 'email')} type='email'><Icon>account_circle</Icon></Input>
                  {errorMsg.loginEmailError}
                  <Input s={12} type='password' className={"white-text " + (this.state.login.passwordError ? "invalid" : "valid")} label="Password" value={this.state.login.password} onChange={(e) => this.handleChange(e, 'login', 'password')}><Icon>lock</Icon></Input>
                  {errorMsg.loginPasswordError}
                </Row>
              </Tab>
              <Tab title="Register" active>
                <Row className="modalForm">
                  <Input s={12} className={"white-text " + (this.state.register.emailError ? "invalid" : "valid")} label="Email" value={this.state.register.email} onChange={(e) => this.handleChange(e, 'register', 'email')} type='email'><Icon>account_circle</Icon></Input>
                  {errorMsg.registerEmailError}
                  <Input s={12} label="Confirm Email" className={"white-text " + (this.state.register.conEmailError ? "invalid" : "valid")} value={this.state.register.conEmail} onChange={(e) => this.handleChange(e, 'register', 'conEmail')} type='email'/>
                  {errorMsg.registerConEmailError}
                  <Input s={12} type='password' className={"white-text " + (this.state.register.passwordError ? "invalid" : "valid")} label="Password" value={this.state.register.password} onChange={(e) => this.handleChange(e, 'register', 'password')}><Icon>lock</Icon></Input>
                  {errorMsg.registerPasswordError}
                  <Input s={12} label="Confirm Password" type='password' className={"white-text " + (this.state.register.conPasswordError ? "invalid" : "valid")} value={this.state.register.conPassword} onChange={(e) => this.handleChange(e, 'register', 'conPassword')}/>
                  {errorMsg.registerConPasswordError}
                </Row>
              </Tab>
            </Tabs>
          </Modal>
        </ul>
      </div>
    )
  }
}
