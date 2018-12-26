import React, { Component, Fragment } from 'react';
/**
 * Presentational component
 * A group of buttons where only 1 can be chosen,
 * Horizontal pill design
 * 
 * @param [] inputs - array of objects to select from
 * input object example:
 * { value: {string}, label: {string|HTML} }
 * 
 * @returns component
 */

import styles from './button__pill-group.css';

export default ({ options, name, onChange, selectedValue }) => {
  const formattedInputs = options.map((input, index) => {
    const { value, label} = input;
    console.log('input: ', input);
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
    <div className="button__pill-group">
      { formattedInputs.map((input) => input) }
    </div>
  )
}
