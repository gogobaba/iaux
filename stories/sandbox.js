import React from 'react';
import { storiesOf } from '@storybook/react';

import AudioPlayer from '../packages/components/sandbox/theatre__audio-player-with-3rd-party/AudioPlayerMultipleSources';
import * as audioFile from '../packages/components/sandbox/theatre__audio-player-with-3rd-party/AudioPlayerDataParser';

const { default: file,  } = audioFile;
const itemID = file.identifier;
const item = file.item;
const urlPrefix = `${file.server}${file.dir}`;

storiesOf('Sandbox', module)
  .add('Theatre - Audio Player with Spotify & Youtube', () => (
    <div className="navia">
      <AudioPlayer
        itemID = { itemID }
        urlPrefix = { urlPrefix }
        item = { file }
      />
    </div>
  ))
  .add('example', () => (
    <button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></button>
  ));
  