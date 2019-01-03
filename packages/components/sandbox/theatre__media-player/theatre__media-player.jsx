import React, { Component } from 'react';

import { SelectorRadioGroup } from '../selector__radio-group/selector__radio-group';

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
    return (
    <SelectorRadioGroup
      options = { mediaSource }

    />
    )
  }

  render () {
    const {
      onClickSelectedMedia,
      mediaTypeSelected,
    } = this.props;

    return (
      <section className="theatre__media-player">
        <div className="content">
          {/* { this.showMedia() } */}
        </div>
        <div className="tabs">
          <SelectorRadioGroup
            options = {this.viewOptions()}
            onChange = { this.toggleMediaSource }
            selectedValue = {mediaTypeSelected}
          />
        </div>
      </section>
    )
  }
}