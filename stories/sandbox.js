import React from 'react';
import { storiesOf } from '@storybook/react';

import AudioPlayer from '../packages/widgets/sandbox/audio-player-multiple-sources/AudioPlayerMultipleSources';
import * as audioFile from '../packages/widgets/sandbox/audio-player-multiple-sources/AudioPlayerDataParser';

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
  