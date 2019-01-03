import React, { Component } from 'react';
import JWPlayerContainer from '../jwplayer-comp/jwplayer-comp';
import { SelectorRadioGroup } from '../../directory';

import style from './theatre__media-player.css';
/**
 * 
 * Props:
 * @param array availableMedia
 */
export default class TheatreMediaPlayer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showLinerNotes: false
    };

    this.viewOptions = this.viewOptions.bind(this);
    this.toggleMediaSource = this.toggleMediaSource.bind(this);
    this.showMedia = this.showMedia.bind(this);
  }

  toggleMediaSource (event) {
    debugger;
  }

  viewOptions() {
    const { linerNotes = null, mediaSource } = this.props;
    if (linerNotes) {
      mediaSource.push({
        label: <Fragment><img /> {`Liner Notes`}</Fragment>,
        value: 'liner-notes'
      })
    }
    console.log('mSSS, ', mediaSource);
    return mediaSource;
  }

  showMedia () {
    const { mediaToPlay } = this.props;
    const { source } = mediaToPlay;
    if (source === 'archive') {
      console.log('!!!!!!!!!!!!!!!!!', mediaToPlay);
      return <JWPlayerContainer playlist = {[mediaToPlay]} />
    }
  }

  render () {
    const {
      onClickSelectedMedia,
      mediaToPlay
    } = this.props;

    console.log("!! - ", this.props)
    return (
      <section className="theatre__media-player">
        <div className="content-window">
          { this.showMedia() }
        </div>
        <div className="tabs">
          <SelectorRadioGroup
            options = {this.viewOptions()}
            onChange = { this.toggleMediaSource }
            selectedValue = {mediaToPlay.source}
            wrapperStyle="tab-bottom"
          />
        </div>
      </section>
    )
  }
}