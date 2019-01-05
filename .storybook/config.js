import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/buttons-selectors.js');
}

configure(loadStories, module);