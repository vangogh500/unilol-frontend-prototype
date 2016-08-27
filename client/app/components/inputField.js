/*
 * Basic component for input fields used in the Form component
 * props: name, model, type, label, img
 *  @name - a String for labeling/identitifying purposes (should be unique)
 *  @model - a String representing the value
 *  @type - a String representing the type of input to use
 *  @label - a String which will be used for labeling
 *  @img - a String representing the materialize icon to use
 */
import React from 'react'

export default class InputField extends React.Component {
  render() {
    return(
      <div className={"input-field col grey-text text-darken-1 " + (this.props.width ? this.props.width : "s12")}>
        <i className="material-icons prefix">{this.props.img}</i>
        <input noValidate type={this.props.type} name={this.props.name} value={this.props.model} className={(this.props.errorMsg ? "invalid" : "valid")} />
        <label>{this.props.label}</label>
        <span className={"red-text " + (this.props.errorMsg ? "" : "hide")}>{this.props.errorMsg}</span>
      </div>
    )
  }
}
