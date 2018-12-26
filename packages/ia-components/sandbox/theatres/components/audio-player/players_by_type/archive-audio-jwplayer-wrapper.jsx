import React, { Component } from 'react';
import PropTypes from 'prop-types';

const previousButton = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-next" style="transform: rotate(180deg)" viewBox="0 0 240 240"><path d="M165,60v53.3L59.2,42.8C56.9,41.3,55,42.3,55,45v150c0,2.7,1.9,3.8,4.2,2.2L165,126.6v53.3h20v-120L165,60L165,60z"></path></svg>';
const nextButton = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-next" viewBox="0 0 240 240"><path d="M165,60v53.3L59.2,42.8C56.9,41.3,55,42.3,55,45v150c0,2.7,1.9,3.8,4.2,2.2L165,126.6v53.3h20v-120L165,60L165,60z"></path></svg>';

/**
 * IA Audio Player
 *
 * Uses global: jwplayer
 *
 * It will display photo if given, and will overlay the media player at the base of the photo.

 *
 * @param { string } backgroundPhoto
 * @param { string } photoAltTag
 *
 * @return component
 */
class ArchiveAudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.jwPlayerInstance = React.createRef();

    // expecting jwplayer to be globally ready
    this.state = {
      player: null,
      playerPlaylistIndex: 0
    };

    this.registerPlayer = this.registerPlayer.bind(this);
    this.fixControlBarStyling = this.fixControlBarStyling.bind(this);
    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
    this.onPlaylistItemCB = this.onPlaylistItemCB.bind(this);
    this.emitPlaylistChange = this.emitPlaylistChange.bind(this);
    this.onReady = this.onReady.bind(this);
  }

  componentDidMount() {
    this.registerPlayer();
  }

  componentDidUpdate({ sourceData: { index: prevIndex } }, { playerPlaylistIndex: prevPlaylistIndex }) {
    const { player, playerPlaylistIndex } = this.state;
    const { sourceData: { index } } = this.props;

    const propsIndexChanged = prevIndex !== index;
    const playerIndexChanged = prevPlaylistIndex !== playerPlaylistIndex;
    const manuallyJumpToTrack = propsIndexChanged && !playerIndexChanged;

    if (manuallyJumpToTrack) {
      return player.playN(index);
    }

    return null;
  }

  onPlaylistItemCB(e) {
    const controllerIndex = this.props.sourceData.index;
    const playerPlaylistIndex = e.index;
    if (controllerIndex === playerPlaylistIndex) return;

    this.setState({ playerPlaylistIndex }, this.emitPlaylistChange);
  }

  onReady(player) {
    player.on('playlistItem', e => this.onPlaylistItemCB);
  }

  registerPlayer() {
    const { sourceData, jwplayerInfo } = this.props;
    const { jwplayerPlaylist, identifier, collection } = jwplayerInfo;

    // We are using IA custom global Player class to instatiate the player
    const baseConfig = {
      start: 0,
      embed: null,
      so: true,
      autoplay: false,
      width: 0,
      height: 0,
      list_height: 0,
      audio: true,
      responsive: true,
      identifier,
      collection,
      waveformer: 'jw-holder',
      hide_list: true,
      onReady: this.onReady,
      playlistItemCB: this.onPlaylistItemCB
    };

    if (window.Play && Play) {
      const player = Play('iaux-player', jwplayerPlaylist, baseConfig);
      this.setState({ player });
    }
  }

  waveFormProgress(event) {
    const { position, duration } = event;
    const percentage = (position / duration) * 100;

    const progressBar = document.getElementById('waveform-progress');
    progressBar.style.width = `${percentage}%`;
  }

  fixControlBarStyling() {
    const { player } = this.state;

    player.addButton(nextButton, 'next track', this.goToNext, 'next-btn');
    player.addButton(previousButton, 'previous track', this.goToPrevious, 'previous-btn');

    const playerContainer = player.getContainer();
    const buttonContainer = playerContainer.querySelector('.jw-button-container');
    const spacer = buttonContainer.querySelector('.jw-spacer');
    const timeSlider = playerContainer.querySelector('.jw-slider-time');
    const chromeCast = buttonContainer.querySelector('.jw-icon-cast');
    const iconRewind = buttonContainer.querySelector('.jw-icon-rewind');
    const nativeNextButton = buttonContainer.querySelector('.jw-icon-next');
    const nextBtn = buttonContainer.querySelector('div[button="next-btn"]');
    const previousBtn = buttonContainer.querySelector('div[button="previous-btn"]');

    nextBtn.setAttribute('style', 'display: inline-block; padding-top: 10px; padding-right: 4px;');
    previousBtn.setAttribute('style', 'display: inline-block; padding-top: 10px; padding-right: 7px;');

    buttonContainer.removeChild(nativeNextButton);
    buttonContainer.removeChild(iconRewind);
    buttonContainer.removeChild(chromeCast);
    buttonContainer.replaceChild(timeSlider, spacer);
  }

  emitPlaylistChange() {
    const { playerPlaylistIndex } = this.state;
    const { jwplayerPlaylistChange } = this.props;

    jwplayerPlaylistChange({ newTrackIndex: playerPlaylistIndex });
  }

  // event handlers
  goToNext(e) {
    const { player } = this.state;
    player.playlistNext();
  }

  goToPrevious(e) {
    const { player } = this.state;
    player.playlistPrev();
  }

  render() {
    const {
      backgroundPhoto,
      photoAltTag,
    } = this.props;
    return (
      <div className="ia-player-wrapper">
        { backgroundPhoto
          && (
          <img
            className="background-photo"
            src={backgroundPhoto}
            alt={photoAltTag}
          />
          )
        }
        <div className="iaux-player-wrapper">
          <div id="iaux-player" />
        </div>
      </div>
    );
  }
}

ArchiveAudioPlayer.defaultProps = {
  backgroundPhoto: '',
  photoAltTag: ''
};

ArchiveAudioPlayer.propTypes = {
  backgroundPhoto: PropTypes.string,
  photoAltTag: PropTypes.string,
  nextTrackCB: PropTypes.func.isRequired,
  previousTrackCB: PropTypes.func.isRequired,
  jwPlayerPlaylist: PropTypes.array.isRequired,
  sourceData: PropTypes.object.isRequired // todo: add shape
};

export default ArchiveAudioPlayer;

/*


config:

    // initialize setup & keep player instance
    // const config = Object.assign({}, sourceData, {
    //   playlist: jwplayerPlaylist,
    //   height: 40,
    //   width: '',
    //   autostart: false,
    // })

    // const player = jwplayer('ia-jw-audio-player').setup(config)
    // console.log('PLAYER', player.getConfig())

    // player.on('error', (e) => {
    //   console.log('ERROR on setup, ', e)
    // })
    //   .on('ready', () => this.fixControlBarStyling())
    //   .on('playlistItem', e => this.onPlaylistItemCB(e))
    //   .on('time', e => this.waveFormProgress(e))
    //   .on('warning', () => { debugger; })


-------


    // const waveformImage = jwPlayerPlaylist[trackIndex].image

        {/*  div className="audio-player-wrapper">
          <div className="waveform-container">
        //     <div id="waveform-progress" className="waveform-progress" />
        //     // <img src={waveformImage} className="waveform" />
        //   </div>
      // </div>
              <div ref={this.jwPlayerInstance} className="jwssplayer" id="ia-jw-audio-player" />

*/
