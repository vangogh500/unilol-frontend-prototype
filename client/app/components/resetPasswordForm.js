/*
 * Container for Reset Password Form
 */

import React from 'react'
import Form from './form'
import {validateEmail, validateEdu, validatePassword} from '../util/validation'

/*
 * Fields: email, conEmail
 *  @email - email of user to reset password of
 *  @conEmail - confirmation email
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
  }
}

/*
 * Validator
 * rules:
 *  @email - checks validity of email => checks that email ends with an .edu domain
 *  @conEmail - checks if value matches that of @email
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
    case "conEmail":
      if(value == values.email) {
        return ""
      }
      else {
        return "Does not match your email field"
      }
      break;
  }
}

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <Form fields={FIELDS} validator={VALIDATOR}/>
    )
  }
}
