import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import CardCodeEditor from './CardCodeEditor';

const pkgjson = require('../../../package.json');

export const isValidCallback = (val, setError) => {
  try {
    setError(false);
    // comments are not valid JSON so remove before check
    const _value = val.replace('/* write your code here */', '');

    if (_value === '') {
      setError('JSON value must not be an empty string');
    } else {
      const json = JSON.parse(_value);
      // Check for non-exception throwing cases (false, 1234, null)
      if (json && typeof json === 'object') {
        return json;
      }
      setError(`${_value.substring(0, 8)} is not valid JSON`);
    }
  } catch (e) {
    setError(e.message);
  }
  return false;
};

storiesOf('Watson IoT/CardCodeEditor', module)
  .add('default', () => (
    <CardCodeEditor
      onSubmit={isValidCallback}
      onClose={() => {}}
      language={select('Editor language', ['json', 'javascript', 'css'])}
      onCopy={value => console.log(value)}
      initialValue="/* write your code here */"
    />
  ))
  .add('with preloaded content', () => (
    <CardCodeEditor
      onSubmit={isValidCallback}
      onClose={() => {}}
      onCopy={value => console.log(value)}
      initialValue={JSON.stringify(pkgjson, null, 2)}
    />
  ));
