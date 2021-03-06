'use strict';

const buildLogLevels = require('../../util').buildLogLevels;
const Log = require('../../util/log');
const DEFAULT_LOG_LEVEL = require('../../util/constants').DEFAULT_LOG_LEVEL;
let nInstances = 0;

/**
 * A {@link LocalTrackPublication} is a {@link LocalTrack} that has been
 * published to a {@link Room}.
 * @property {Track.Kind} kind - kind of the published {@link LocalTrack}
 * @property {LocalTrack} track - the {@link LocalTrack}
 * @property {string} trackName - the {@link LocalTrack}'s name
 * @property {Track.SID} trackSid - SID assigned to the published
 *   {@link LocalTrack}
 */
class LocalTrackPublication {
  /**
   * Construct a {@link LocalTrackPublication}.
   * @param {Track.SID} sid - SID assigned to the published {@link LocalTrack}
   * @param {LocalTrack} track - the {@link LocalTrack}
   * @param {function(LocalTrackPublication): void} unpublish - The callback
   *   that unpublishes the {@link LocalTrackPublication}
   * @param {LocalTrackPublicationOptions} options - {@link LocalTrackPublication}
   *   options
   */
  constructor(sid, track, unpublish, options) {
    options = Object.assign({
      logLevel: DEFAULT_LOG_LEVEL
    }, options);

    const logLevels = buildLogLevels(options.logLevel);

    Object.defineProperties(this, {
      _instanceId: {
        value: nInstances++
      },
      _log: {
        value: options.log || new Log('default', this, logLevels),
      },
      _unpublish: {
        value: unpublish
      },
      kind: {
        enumerable: true,
        value: track.kind
      },
      track: {
        enumerable: true,
        value: track
      },
      trackName: {
        enumerable: true,
        value: track.name
      },
      trackSid: {
        enumerable: true,
        value: sid
      }
    });
  }

  toString() {
    return `[LocalTrackPublication #${this._instanceId}: ${this.trackSid}]`;
  }

  /**
   * Unpublish a {@link LocalTrackPublication}. This means that the media
   * from this {@link LocalTrackPublication} is no longer available to the
   * {@link Room}'s {@link RemoteParticipant}s.
   * @returns {this}
   */
  unpublish() {
    this._unpublish(this);
    return this;
  }
}

/**
 * {@link LocalTrackPublication} options
 * @typedef {object} LocalTrackPublicationOptions
 * @property {LogLevel|LogLevels} logLevel - Log level for 'media' modules
 */

module.exports = LocalTrackPublication;
