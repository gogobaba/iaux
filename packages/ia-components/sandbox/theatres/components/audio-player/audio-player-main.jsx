import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IAAudioPlayer from './players_by_type/archive-audio-jwplayer-wrapper';
import ThirdPartyEmbededPlayer from './players_by_type/third-party-embed';
import { HorizontalRadioGroup } from '../../../../index';

/**
 * Configures the required props to render the ThirdPartyEmbeddedPlayer
 *
 * @param { string } source
 * @param { object } sourceData
 * @param { string } urlExtensions
 */
const getExternalMediaPlayer = ({ source, sourceData, urlExtensions }) => {
  const externalSourceInfo = sourceData[source];
  if (!externalSourceInfo) return null;

  const { urlPrefix, id, mediaName } = externalSourceInfo;
  const sourceURL = `${urlPrefix}${id}${urlExtensions}`;
  return (
    <ThirdPartyEmbededPlayer
      sourceURL={sourceURL}
      title={mediaName}
    />
  );
};

/**
 * Theatre Audio Player
 * This is the main controller or the audio player
 * It will toggle between IA player & third party player
 *
 * When we have liner notes, this will also be responsible for
 * toggling between liner notes & player while continuing to play audio
 *
 * Props: see PropTypes
 */
export default class TheatreAudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.showMedia = this.showMedia.bind(this);
    this.createTabs = this.createTabs.bind(this);
  }

  /**
   * Figures out which player to use based on the given `source`
  */
  showMedia() {
    const { source, sourceData, urlExtensions = '' } = this.props;
    const isExternal = source === 'youtube' || source === 'spotify';
    const mediaElement = isExternal
      ? getExternalMediaPlayer({ source, sourceData, urlExtensions })
      : <IAAudioPlayer {...this.props} />;
    return mediaElement;
  }

  /**
   * Creates tabs section underneath the player window
   */
  createTabs() {
    // create options
    const { customSourceLabel } = this.props;
    const sourceLabel = {
      value: 'player',
      label: customSourceLabel
    };

    return (
      <HorizontalRadioGroup
        options={[sourceLabel]}
        onChange={this.toggleMediaSource}
        selectedValue="player"
        wrapperStyle="tab-bottom"
      />
    );
  }

  render() {
    return (
      <section className="theatre__audio-player">
        <div className="content-window">
          { this.showMedia() }
          { /* todo: add liner notes reader here */ }
        </div>
        <div className="tabs">
          { this.createTabs() }
        </div>
      </section>
    );
  }
}

TheatreAudioPlayer.defaultProps = {
  backgroundPhoto: '',
  photoAltTag: '',
  urlExtensions: '',
};

TheatreAudioPlayer.propTypes = {
  source: PropTypes.oneOf([
    'youtube',
    'spotify',
    'archive'
  ]).isRequired,
  sourceData: PropTypes.shape({
    urlPrefix: PropTypes.string,
    id: PropTypes.string,
    mediaName: PropTypes.string
  }).isRequired,
  urlExtensions: PropTypes.string,
  backgroundPhoto: PropTypes.string,
  photoAltTag: PropTypes.string,
  customSourceLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object // React component
  ]).isRequired,
};
