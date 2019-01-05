import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  SelectorRadioGroup,
} from '../packages/ia-components/directory';

const options1 = [
  {label: 'hello', value: 'world'},
  {label: 'goodbye', value: 'farewell'},
  {label: 'foo', value: 'bar'}
]
const selected1 = 'farewell';

const darkTheme = {
  backgroundColor: 'rgb(0,0,0)',
  color: '#fff',
  padding: '5rem'
}

const placeholderStyle = {
  border: '.1rem solid',
  width: '200px',
  height: '100px'
}

storiesOf('Selectors', module)
  .add('radios as rounded group', () => 
    <SelectorRadioGroup
      options={options1}
      selectedValue={selected1}
      name="rounded-group"
      wrapperStyle="rounded"
    />
  )
  .add('dark - radios as rounded group', () => {
    return (
      <div style={ darkTheme }>
        <SelectorRadioGroup
          options={options1}
          selectedValue={selected1}
          name="rounded-group"
          wrapperStyle="rounded"
        />
      </div>
    )}
  )
  .add('radios as bottom tabs', () => {
    return (
      <div>
        <div style={ placeholderStyle }>placeholder item</div>
        <SelectorRadioGroup
          options={options1}
          selectedValue={selected1}
          name="rounded-group"
          wrapperStyle="tab-bottom"
        />
      </div>
    )}

  )
  .add('dark - radios as bottom tabs', () => {
    return (
      <div style={ darkTheme }>
        <div style={ placeholderStyle }>placeholder item</div>
        <SelectorRadioGroup
          options={options1}
          selectedValue={selected1}
          name="rounded-group"
          wrapperStyle="tab-bottom"
        />
      </div>
    )}
  )