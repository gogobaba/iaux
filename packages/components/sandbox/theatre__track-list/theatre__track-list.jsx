import React from 'react';
import _ from 'lodash';

import style from './theatre__track-list.css';


/**
 * Draws 1 row with track info
 * 
 * @param bool selected
 * @param function onSelected
 * @param object track 
 * 
 * @return component
 */
const individualTrack = ({ selected, onSelected, thisTrack }) => {
  const { track: trackNumber, title, length, artist } = thisTrack;
  console.log('track! -xxxx ', selected, thisTrack);
  const key = `individual-track-${trackNumber}`
  return (
    <li
      data-track-number={trackNumber}
      className={`${selected ? 'selected ' : ''}track `}
      onClick={onSelected}
      key={key}
      >
      {parseInt(trackNumber, 10)} {title} - {artist} {length}
    </li>
  )
}

/**
 * This creates the track list on audio player
 * It is a 2 column layout with 12 items per column
 * this will swipes/scrolls left if more than 2 columns
 * 
 * @param array tracks - list of tracks to display, in order
 * @param function onSelected - click handler for track selection
 * 
 * @return component
 */
export default ({ tracks, onSelected = () => {}, selectedTrack }) => {
  // TODO: check if tracks are private, then parse out the appropriate file type to draw
  const groupedTracks = _.chunk(tracks, 12);

  return (
    <ul className="track-listing">
      {
        groupedTracks.map((group, index) => {
          return (
            <li key={`track-listing-groups-${index}`} class="listing-groups">
              <ul className="group">
                {
                  group.map((thisTrack) => {
                    const { track: trackNumber } = thisTrack;
                    const selected = parseInt(trackNumber, 10) === selectedTrack;
                    return individualTrack({thisTrack, onSelected, selected})
                  })
                }
              </ul>
            </li>
          )
        })
      }

    </ul>
  )
}
