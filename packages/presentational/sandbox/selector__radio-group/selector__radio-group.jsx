import React, { Component, Fragment } from 'react';
/**
 * Presentational component
 * A group of buttons where only 1 can be chosen,
 * Horizontal pill design
 * 
 * @param [] options - array of objects to select from
 * input object example:
 * { value: {string}, label: {string|HTML} }
 * @param string name - name of radio group to ensure only 1 can be toggle-able
 * @param function onChange - event handler
 * @param string selectedValue - actual value that is selected
 * @param string wrapperStyle - custom wrapper css class
 * 
 * @returns component
 */

import styles from './selector__radio-group.css';

export default ({ options, name, onChange, selectedValue, wrapperStyle = '' }) => {
  const formattedInputs = options.map((input, index) => {
    const { value, label} = input;
    return (
      <Fragment key={`name-${index}`}>
        <input
          type="radio"
          id={ value }
          name={ name }
          value={ value }
          onChange={ onChange }
          checked={ selectedValue === value ? 'checked' : '' }
        ></input>
        <label htmlFor={value}>{label}</label>
      </Fragment>
    )
  });
  return (
    <div className={`selector__radio-group ${wrapperStyle}`}>
      { formattedInputs.map((input) => input) }
    </div>
  )
}
