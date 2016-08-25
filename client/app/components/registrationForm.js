/*
 * Container for Registration Form
 */

import React from 'react'
import Form from './form'
import {validateEmail, validateEdu, validatePassword} from '../util/validation'

/*
 * Fields: email, conEmail, password, conPassword
 *  @email - email to register user
 *  @password - password to register user
 *  @conEmail - confirmation email
 *  @conPassword - confirmation password
 */
const FIELDS = {
  email: {
    required: true,
    img: "account_circle",
    label: "Email",
    type: "email"
  },
  conEmail: {
    required: false,
    label: "Confirm Email",
    type: "email"
  },
  password: {
    required: true,
    img: "lock",
    label: "Password",
    type: "password"
  },
  conPassword: {
    required: false,
    label: "Confirm Password",
    type: "password"
  }
}

/*
 * Validator
 * rules:
 *  @email - checks validity of email => checks that email ends with an .edu domain
 *  @password - 8 to 10 chars, >= 1 uppercase, >= 1 lowercase, >= 1 number
 *  @conEmail - checks if value matches that of @email
 *  @conPassword - checks if value matches that of @password
 */
const VALIDATOR = (field, value, values, msgs) => {
  switch(field) {
    case "email":
      // side effects
      if(value == values.conEmail) {
        msgs.conEmail = ""
      }
      else {
        msgs.conEmail = "Does not match your email field"
      }
      // main validator
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
      // side effects
      if(value == values.conPassword) {
        msgs.conPassword = ""
      }
      else {
        msgs.conPassword = "Does not match your password field"
      }
      // main validator
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
    case "conEmail":
      if(value == values.email) {
        return ""
      }
      else {
        return "Does not match your email field"
      }
      break;
    case "conPassword":
      if(value == values.password) {
        return ""
      }
      else {
        return "Does not match your password field"
      }
      break;
  }
}

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <Form fields={FIELDS}
        validator={VALIDATOR}
        handleClick={(fields) => this.props.handleClick(fields.email, fields.password)}
        buttonLabel="Register" />
    )
  }
}
