/*
 * Container for Profile Setup Form
 */

import React from 'react'
import Form from './form'
import {validateEmail, validateEdu, validatePassword} from '../util/validation'
import { connect } from 'react-redux'

/*
 * Fields: first name, last name
 */
const FIELDS = {
  ign: {
    required: true,
    img: "perm_identity",
    label: "League of Legends Ign",
    type: "text"
  },
  conIgn: {
    required: false,
    label: "Confirm Ign",
    type: "text"
  }
}

/*
 * Validator
 * rules:
 *  @email - checks validity of email => checks that email ends with an .edu domain
 *  @password - 8 to 10 chars, >= 1 uppercase, >= 1 lowercase, >= 1 numbe
 */
const VALIDATOR = (field, value, values, msgs) => {
  switch(field) {
    case "ign":
      // side effects
      if(value == values.conIgn) {
        msgs.conIgn = ""
      }
      else {
        msgs.conIgn = "Does not match your ign"
      }
      if(!value) {
        return "This field is required"
      }
      else {
        return ""
      }
    case "conIgn":
      if(value == values.ign) {
        return ""
      }
      else {
        return "Does not match your ign"
      }
    default:
      return ""
  }
}

export default class SummonerSetupForm extends React.Component {
  render() {
    return (
      <Form fields={FIELDS}
        validator={VALIDATOR}
        buttonLabel="Submit"
        handleClick={(fields) => this.props.handleClick(fields.ign)}/>
    )
  }
}
