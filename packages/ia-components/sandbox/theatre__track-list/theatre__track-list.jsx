import React from 'react';
import _ from 'lodash';

import style from './theatre__track-list.less';


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
  const key = `individual-track-${trackNumber}`
  return (
    <tr
      data-track-number={trackNumber}
      className={`${selected ? 'selected ' : ''}track `}
      onClick={onSelected}
      key={key}
      >
      <td className="track-number">{parseInt(trackNumber, 10)}</td>
      <td className="track-title"><p>{title} - <i>{artist}</i></p></td>
      <td className="track-length">{length}</td>
    </tr>
  )
}

const createTrackListingTable = (tracks, selectedTrack, onSelected) => {
  return (
    <table className="track-list-group">
    {
      tracks.map((thisTrack) => {
        const { track: trackNumber } = thisTrack;
        const selected = parseInt(trackNumber, 10) === selectedTrack;
        return individualTrack({thisTrack, onSelected, selected})
      })
    }
    </table>
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
  
  const groupedTracks = tracks.length > 12 ?_.chunk(tracks, 12) : [[tracks]];
  console.log("GROUPED -=-", groupedTracks.length);

  const hasOnlyOneGroup = groupedTracks.length === 1;

  const trackListing = groupedTracks.map((group, index) => {
    console.log("*********", group)
      return (
        <li key={`track-listing-groups-${index}`} class={`listing-groups ${hasOnlyOneGroup ? 'full-width' : ''}`}>
          { group.map((trackGroup) => createTrackListingTable(trackGroup, selectedTrack, onSelected))}
        </li>
      )
    })

  return (
    <ul className="track-listing">
      { trackListing }
    </ul>
  )
}
