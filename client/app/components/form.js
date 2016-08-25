/*
 * Basic Form Component
 * props: fields, validator (neither should change in the lifespan of the app)
 *  @fields (SHOULD NOT BE MUTABLE) - an object where each attribute has an object representing a field
 *   field attributes: required, img, label, type
 *    @required: bool representing if the field is required
 *    @img: string representing materialize icon to use
 *    @label: string representing the label for the field
 *    @type: string representing the type of input to use
 *   EXAMPLE: {
 *      email: {
 *        requuired: true,
 *        img: "account_circle",
 *        label: "Email",
 *        type: "email"
 *      }
 *   }
 *  @validator (SHOULD NOT BE MUTABLE) - a function which does the validation for each field
 *   params: field, value
 *    @field - a string representing which field is being validated
 *    @value - a string representing the value to be validated
 *   returns: a string representing the error message to be displayed after validating (blank if none)
 *   EXAMPLE: function(field, value) {
 *      switch(field) {
 *        case "email":
 *          if(someEmailValidation(email)) {
 *            return ""
 *          }
 *          return "Not a valid email"
 *      }
 *   }
 */
import React from 'react'
import InputField from './inputField'
/*
 * Implementation Notes: State is stored in the following format:
 *  {
 *    fields: object
 *    errorMsgs: object
 *  }
 * @fields has String properties representing the values for each fields
 * @errorMsgs has String properties representing the values of the error messages for each field
 */
export default class Form extends React.Component {
  constructor(props) {
    super(props)
    var initialState = {
      fields: {},
      errorMsgs: {}
    }
    for(var field in this.props.fields) {
      if(this.props.fields[field].required == true) {
        initialState.errorMsgs[field] = "This field is required"
      }
      else {
        initialState.errorMsgs[field] = ""
      }
      initialState.fields[field] = ""
    }
    this.state = initialState
  }
  handleChange(e) {
    e.preventDefault()
    const currentState = this.state
    currentState.fields[e.target.name] = e.target.value
    this.setState(currentState)
    this.handleValidation(e)
  }
  handleClick(e) {
    e.preventDefault()
    this.props.handleClick(this.state.fields)
  }

  handleValidation(e) {
    const currentState = this.state
    currentState.errorMsgs[e.target.name] = this.props.validator(e.target.name, e.target.value, this.state.fields, this.state.errorMsgs)
    this.setState(currentState)
  }
  isFormValid() {
    for(var msg in this.state.errorMsgs) {
      if(this.state.errorMsgs[msg]) return false
    }
    return true
  }
  render() {
    var disabled = !this.isFormValid()
    return (
      <div>
        <form noValidate onChange={(e) => this.handleChange(e)} className="animated slideInRight">
          {
            Object.keys(this.state.fields).map((field, index) => {
              return (
                <InputField
                  type={this.props.fields[field].type}
                  img={this.props.fields[field].img}
                  name={field} errorMsg={this.state.errorMsgs[field]}
                  model={this.state.fields[field]}
                  label={this.props.fields[field].label}
                  key={index}/>
              )
            })
          }
        </form>
        <button
          onClick={(e) => this.handleClick(e)}
          disabled={disabled}
          className={"btn waves-effect waves-light form-button"}>
          {this.props.buttonLabel}
          <i className="material-icons right">input</i>
        </button>
      </div>
    )
  }
}
