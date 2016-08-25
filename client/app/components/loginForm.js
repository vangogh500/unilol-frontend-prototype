/*
 * Container for Login Form
 */

import React from 'react'
import Form from './form'
import {validateEmail, validateEdu, validatePassword} from '../util/validation'
import { connect } from 'react-redux'

/*
 * Fields: email, conEmail, password, conPassword
 *  @email - email of user to login as
 *  @password - password of user to login as
 */
const FIELDS = {
  email: {
    required: true,
    img: "account_circle",
    label: "Email",
    type: "email"
  },
  password: {
    required: true,
    img: "lock",
    label: "Password",
    type: "password"
  }
}

/*
 * Validator
 * rules:
 *  @email - checks validity of email => checks that email ends with an .edu domain
 *  @password - 8 to 10 chars, >= 1 uppercase, >= 1 lowercase, >= 1 numbe
 */
const VALIDATOR = (field, value) => {
  switch(field) {
    case "email":
      if(!value) {
        return "This field is required"
      }
      else if(!validateEmail(value)) {
        return value + " is not a valid email address"
      }
      else if (!validateEdu(value)) {
        return value + " does not have an edu domain"
      }
      else {
        return ""
      }
      break;
    case "password":
      if(!value) {
        passwordErrorMsg: "This field is required"
      }
      else if(!validatePassword(value)) {
        return "Minimum 8 and Maximum 10 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, and 1 Number"
      }
      else {
        return ""
      }
      break;
  }
}

export default class LoginForm extends React.Component {
  render() {
    return (
      <Form fields={FIELDS}
        validator={VALIDATOR}
        buttonLabel="Login"
        handleClick={(fields) => this.props.handleClick(fields.email, fields.password)}/>
    )
  }
}
