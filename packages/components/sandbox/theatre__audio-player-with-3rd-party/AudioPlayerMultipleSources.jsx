/* eslint-disable */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash'; // TODO: only import used functions
import {
  SelectorRadioGroup,
  TheatreTrackList,
  TheatreMediaPlayer
} from '../../directory';

import Styles from './audio-player.css';

// state is needed for:
// 1) knowing which track is playing
// 2) source of track
// 3)


export default class AudioPlayerMultipleSources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playSamplesOnly: false,
      audioSourceToPlay: 'archive',
      trackToPlay: 1,
      currentlyPlaying: false,
      autoPlay: false  // toggle after user plays or selects a track?
    };

    this.getAudioSources = this.getAudioSources.bind(this);
    this.onAudioTypeSelect = this.onAudioTypeSelect.bind(this);
    this.selectThisTrack = this.selectThisTrack.bind(this);
    this.fileToPlay = this.fileToPlay.bind(this);
  }

  fileToPlay () {
    // fetch track reference
    // check if sample, if so, get sample mp3
    // else return mp3
    const { urlPrefix, item: { tracks }} = this.props;
    const {
      audioSourceToPlay,
      trackToPlay,
      playSamplesOnly
    } = this.state;

    const thisTrack = _.find(tracks, ({ track: trackNumber }) => {
      return parseInt(trackNumber, 10) === trackToPlay;
    })

    let returnBody;
    if (audioSourceToPlay === 'archive') {
      returnBody = thisTrack.related.reduce((acc, trackFile) => {
        const { name } = trackFile;
        const dataMap = acc || {};
        // check for waveform
        const isPNG = !!name.match(/.png/g);
        if (isPNG) {
          dataMap.image = `https://${urlPrefix}/${encodeURIComponent(name)}`
        }

        // if sample, get sample.mp3 else get .mp3
        const audioInfoToMatch = playSamplesOnly ? /sample.mp3/g : /.mp3/g;
        const audioTrack = name.match(audioInfoToMatch);
        console.log('at ---- ', audioTrack);

        if (audioTrack) {
          dataMap.file = `https://${urlPrefix}/${encodeURIComponent(name)}`
        }

        return dataMap;
      }, {});
    }
    console.log('returnBody ', returnBody);
    returnBody.source = audioSourceToPlay;
    return returnBody;
  }

  componentWillMount() {
    const { item } = this.props;
    const { collection } = item;

    const playSamplesOnly = _.includes(collection, 'samples_only');
    this.setState({ playSamplesOnly });
  }

  /**
   * This takes an array of externalIdentifiers from an album or track's metadata
   * and returns this object:
   * { spotify: 'spotifyID || null', youtube: 'youtubeID || null' }
   *
   * @param array externalIdentifiers
   * @returns object
   */
  getSpotifyAndYoutubeExternalIdentifiers(externalIdentifiers) {
    return _.chain(externalIdentifiers)
    .filter((exId) => {
      return exId.match(/spotify|youtube/g);
    })
    .reduce(function (acc, curr) {
      /* Examples:
        'urn:spotify:track:0j2XdkOJSneLHYevR6JpBP',
        'urn:youtube:nPHUz8apHjY'
      */
      let holder = acc || {};
      const splitExternalId = curr.split(/:/g);
      const actualId = splitExternalId[splitExternalId.length - 1];
      const externalIdSource = splitExternalId[1];
      holder[externalIdSource] = actualId;
      return holder;
    }, {})
    .value();
  }

  /**
   * This checks for album and tracks to see if they have external identifiers
   *
   * @param object audioFile - structured item metadata
   * @return object { spotify: bool, youtube: bool }
   */
  checkForYoutubeOrSpotifyIds(audioFile) {
    const { tracks } = audioFile;
    const albumIds = this.getSpotifyAndYoutubeExternalIdentifiers(audioFile['external-identifiers']);
    const trackExternalIds = tracks.map((track) => track['external-identifier']);
    const tracksHasYoutubeOrSpotify = trackExternalIds.reduce((acc, externalIds) => {
      const relevantExternalIds = this.getSpotifyAndYoutubeExternalIdentifiers(externalIds);
      let trackHasYoutubeOrSpotify = acc || {};
      trackHasYoutubeOrSpotify.youtube = !!relevantExternalIds.youtube;
      trackHasYoutubeOrSpotify.spotify = !!relevantExternalIds.spotify;
      return trackHasYoutubeOrSpotify;
    }, {});

    return {
      spotify: !!albumIds.spotify || tracksHasYoutubeOrSpotify.spotify,
      youtube: !!albumIds.youtube || tracksHasYoutubeOrSpotify.youtube,
    };
  }
  /**
   * This creates the options of audio sources that a user is able to play
   * 
   * @param bool archiveTypeOnly - signal to only return archive source
   * @return [] - an array of audio sources to feed into audio selector
   */
  getAudioSources(archiveSourceOnly) {
    const { playSamplesOnly } = this.state;
    const { item: audioFile,  } = this.props;
    const archiveAudioType = {
      label:
      <Fragment>
        <img /> {`Archive ${playSamplesOnly ? 'Samples' : ''}`}
      </Fragment>,
      value: 'archive'
    };

    if (archiveSourceOnly) {
      return [archiveAudioType];
    }

    const albumOrTracksHaveYoutubeOrSpotify = this.checkForYoutubeOrSpotifyIds(audioFile);
    const spotify = albumOrTracksHaveYoutubeOrSpotify.spotify ? {
      label: <Fragment><img /> {`Spotify`}</Fragment>,
      value: 'spotify'
    } : null;
    const youtube = albumOrTracksHaveYoutubeOrSpotify.youtube ? {
      label: <Fragment><img /> {`YouTube`}</Fragment>,
      value: 'youtube'
    } : null;

    return _.compact([archiveAudioType, spotify, youtube]);
  }

  onAudioTypeSelect (event) {
    const audioSourceToPlay = event.target.value || this.state.audioSourceToPlay;
    console.log(audioSourceToPlay);
    this.setState({ audioSourceToPlay });
  }

  selectThisTrack (event) {
    // to do, use ref to get value
    const trackNumberDataAttribute = event.target.getAttribute('data-track-number');
    const selectedTrack = trackNumberDataAttribute || this.state.trackToPlay;
    const trackToPlay = parseInt(selectedTrack, 10) ? parseInt(selectedTrack, 10) : null;
    if (trackToPlay) {
      this.setState({ trackToPlay })
    }
  }

  render() {
    console.log('props', this.props);
    const { item } = this.props;
    const { tracks } = item;
    const { audioSourceToPlay, trackToPlay } = this.state;

    return (
      <div className="theatre__wrap">
        <SelectorRadioGroup
          options = { this.getAudioSources() }
          onChange = { this.onAudioTypeSelect }
          name = "audio-source"
          selectedValue = { this.state.audioSourceToPlay }
          wrapperStyle = "rounded"
        />
        <TheatreMediaPlayer
          mediaSource = { this.getAudioSources(true) }
          linerNotes = { null }
          mediaToPlay = { this.fileToPlay() }
        />
        <TheatreTrackList
          tracks = { tracks }
          onSelected = { this.selectThisTrack }
          selectedTrack = { trackToPlay }
        />
      </div>

    );
  }
}

AudioPlayerMultipleSources.defaultProps = {
  urlPrefix: '',
  itemID: '',
  item: {},

};

AudioPlayerMultipleSources.propTypes = {
  urlPrefix: PropTypes.string,
  itemID: PropTypes.string,
  item: PropTypes.object,

};
