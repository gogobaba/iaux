import React from 'react';
import { storiesOf } from '@storybook/react';

import { AudioPlayerWith3rdParty, audioFile } from '../packages/components/directory';

const itemID = audioFile.identifier;
const item = audioFile.item;
const urlPrefix = `${audioFile.server}${audioFile.dir}`;

storiesOf('Sandbox', module)
  .add('Theatre - Audio Player with Spotify & Youtube', () => (
    <div className="navia">
      <AudioPlayerWith3rdParty
        itemID = { itemID }
        urlPrefix = { urlPrefix }
        item = { audioFile }
      />
    </div>
  ))
  .add('example', () => (
    <button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></button>
  ));
  