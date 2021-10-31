// flow-typed signature: fafbc27f7fec53f324a420393fac84e7
// flow-typed version: <<STUB>>/react-native-track-player_v^2.1.0/flow_v0.107.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   'react-native-track-player'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'react-native-track-player' {
  declare function setupPlayer(options?: PlayerOptions): Promise<void>;
  declare function destroy(): any;
  declare type ServiceHandler = () => Promise<void>;
  declare function registerPlaybackService(factory: () => ServiceHandler): void;
  declare function addEventListener(
    event: $Values<typeof Event>,
    listener: (data: any) => void,
  ): $PropertyType<$Exports<'react-native'>, 'EmitterSubscription'>;
  declare function add(
    tracks: Track | Track[],
    insertBeforeIndex?: number,
  ): Promise<void>;
  declare function remove(tracks: number | number[]): Promise<void>;
  declare function removeUpcomingTracks(): Promise<void>;
  declare function skip(trackIndex: number): Promise<void>;
  declare function skipToNext(): Promise<void>;
  declare function skipToPrevious(): Promise<void>;
  declare function updateOptions(options?: MetadataOptions): Promise<void>;
  declare function updateMetadataForTrack(
    trackIndex: number,
    metadata: TrackMetadataBase,
  ): Promise<void>;
  declare function clearNowPlayingMetadata(): Promise<void>;
  declare function updateNowPlayingMetadata(
    metadata: NowPlayingMetadata,
  ): Promise<void>;
  declare function reset(): Promise<void>;
  declare function play(): Promise<void>;
  declare function pause(): Promise<void>;
  declare function stop(): Promise<void>;
  declare function seekTo(position: number): Promise<void>;
  declare function setVolume(level: number): Promise<void>;
  declare function setRate(rate: number): Promise<void>;
  declare function setRepeatMode(
    mode: $Values<typeof RepeatMode>,
  ): Promise<$Values<typeof RepeatMode>>;
  declare function getVolume(): Promise<number>;
  declare function getRate(): Promise<number>;
  declare function getTrack(trackIndex: number): Promise<Track>;
  declare function getQueue(): Promise<Track[]>;
  declare function getCurrentTrack(): Promise<number>;
  declare function getDuration(): Promise<number>;
  declare function getBufferedPosition(): Promise<number>;
  declare function getPosition(): Promise<number>;
  declare function getState(): Promise<$Values<typeof State>>;
  declare function getRepeatMode(): Promise<$Values<typeof RepeatMode>>;
  declare var _default: {
    setupPlayer: typeof setupPlayer,
    destroy: typeof destroy,
    registerPlaybackService: typeof registerPlaybackService,
    addEventListener: typeof addEventListener,
    add: typeof add,
    remove: typeof remove,
    removeUpcomingTracks: typeof removeUpcomingTracks,
    skip: typeof skip,
    skipToNext: typeof skipToNext,
    skipToPrevious: typeof skipToPrevious,
    updateOptions: typeof updateOptions,
    updateMetadataForTrack: typeof updateMetadataForTrack,
    clearNowPlayingMetadata: typeof clearNowPlayingMetadata,
    updateNowPlayingMetadata: typeof updateNowPlayingMetadata,
    reset: typeof reset,
    play: typeof play,
    pause: typeof pause,
    stop: typeof stop,
    seekTo: typeof seekTo,
    setVolume: typeof setVolume,
    setRate: typeof setRate,
    setRepeatMode: typeof setRepeatMode,
    getVolume: typeof getVolume,
    getRate: typeof getRate,
    getTrack: typeof getTrack,
    getQueue: typeof getQueue,
    getCurrentTrack: typeof getCurrentTrack,
    getDuration: typeof getDuration,
    getBufferedPosition: typeof getBufferedPosition,
    getPosition: typeof getPosition,
    getState: typeof getState,
    getRepeatMode: typeof getRepeatMode,
    ...
  };
  declare export default typeof _default;

  /**
   * Get current playback state and subsequent updatates
   */
  declare export var usePlaybackState: () => $Values<typeof State>;
  declare type Handler = (payload: {
    type: $Values<typeof Event>,
    [key: string]: any,
    ...
  }) => void;
  /**
   * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
   * @param events - TrackPlayer events to subscribe to
   * @param handler - callback invoked when the event fires
   */
  declare export var useTrackPlayerEvents: (
    events: $Values<typeof Event>[],
    handler: Handler,
  ) => void;
  declare export interface ProgressState {
    position: number;
    duration: number;
    buffered: number;
  }
  /**
   * Poll for track progress for the given interval (in miliseconds)
   * @param interval - ms interval
   */
  declare export function useProgress(updateInterval?: number): ProgressState;
  declare export {};

  /**
   * Flowtype definitions for interfaces
   * Generated by Flowgen from a Typescript Definition
   * Flowgen v1.14.1
   */

  declare export var IOSCategory: {|
    +Playback: 'playback', // "playback"
    +PlayAndRecord: 'playAndRecord', // "playAndRecord"
    +MultiRoute: 'multiRoute', // "multiRoute"
    +Ambient: 'ambient', // "ambient"
    +SoloAmbient: 'soloAmbient', // "soloAmbient"
    +Record: 'record', // "record"
  |};

  declare export var IOSCategoryMode: {|
    +Default: 'default', // "default"
    +GameChat: 'gameChat', // "gameChat"
    +Measurement: 'measurement', // "measurement"
    +MoviePlayback: 'moviePlayback', // "moviePlayback"
    +SpokenAudio: 'spokenAudio', // "spokenAudio"
    +VideoChat: 'videoChat', // "videoChat"
    +VideoRecording: 'videoRecording', // "videoRecording"
    +VoiceChat: 'voiceChat', // "voiceChat"
    +VoicePrompt: 'voicePrompt', // "voicePrompt"
  |};

  declare export var IOSCategoryOptions: {|
    +MixWithOthers: 'mixWithOthers', // "mixWithOthers"
    +DuckOthers: 'duckOthers', // "duckOthers"
    +InterruptSpokenAudioAndMixWithOthers: 'interruptSpokenAudioAndMixWithOthers', // "interruptSpokenAudioAndMixWithOthers"
    +AllowBluetooth: 'allowBluetooth', // "allowBluetooth"
    +AllowBluetoothA2DP: 'allowBluetoothA2DP', // "allowBluetoothA2DP"
    +AllowAirPlay: 'allowAirPlay', // "allowAirPlay"
    +DefaultToSpeaker: 'defaultToSpeaker', // "defaultToSpeaker"
  |};

  declare interface PlayerOptions {
    /**
     * Minimum time in seconds that needs to be buffered.
     */
    minBuffer?: number;

    /**
     * Maximum time in seconds that needs to be buffered
     */
    maxBuffer?: number;

    /**
     * Time in seconds that should be kept in the buffer behind the current playhead time.
     */
    backBuffer?: number;

    /**
     * Minimum time in seconds that needs to be buffered to start playing.
     */
    playBuffer?: number;

    /**
     * Maximum cache size in kilobytes.
     */
    maxCacheSize?: number;

    /**
     * [AVAudioSession.Category](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616615-category) for iOS.
     * Sets on `play()`.
     */
    iosCategory?: $Values<typeof IOSCategory>;

    /**
     * [AVAudioSession.Mode](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616508-mode) for iOS.
     * Sets on `play()`.
     */
    iosCategoryMode?: $Values<typeof IOSCategoryMode>;

    /**
     * [AVAudioSession.CategoryOptions](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616503-categoryoptions) for iOS.
     * Sets on `play()`.
     */
    iosCategoryOptions?: $Values<typeof IOSCategoryOptions>[];

    /**
     * Indicates whether the player should automatically delay playback in order to minimize stalling.
     * Defaults to `false`.
     */
    waitForBuffer?: boolean;

    /**
     * Indicates whether the player should automatically update now playing metadata data in control center / notification.
     * Defaults to `true`.
     */
    autoUpdateMetadata?: boolean;
  }
  declare export var RatingType: {|
    +Heart: 0, // 0
    +ThumbsUpDown: 1, // 1
    +ThreeStars: 2, // 2
    +FourStars: 3, // 3
    +FiveStars: 4, // 4
    +Percentage: 5, // 5
  |};
  declare interface FeedbackOptions {
    /**
     * Marks wether the option should be marked as active or "done"
     */
    isActive: boolean;

    /**
     * The title to give the action (relevant for iOS)
     */
    title: string;
  }
  declare export var Capability: {|
    +Play: 0, // 0
    +PlayFromId: 1, // 1
    +PlayFromSearch: 2, // 2
    +Pause: 3, // 3
    +Stop: 4, // 4
    +SeekTo: 5, // 5
    +Skip: 6, // 6
    +SkipToNext: 7, // 7
    +SkipToPrevious: 8, // 8
    +JumpForward: 9, // 9
    +JumpBackward: 10, // 10
    +SetRating: 11, // 11
    +Like: 12, // 12
    +Dislike: 13, // 13
    +Bookmark: 14, // 14
  |};
  declare type ResourceObject = number;
  declare interface MetadataOptions {
    ratingType?: $Values<typeof RatingType>;
    forwardJumpInterval?: number;
    backwardJumpInterval?: number;
    likeOptions?: FeedbackOptions;
    dislikeOptions?: FeedbackOptions;
    bookmarkOptions?: FeedbackOptions;
    capabilities?: $Values<typeof Capability>[];
    stopWithApp?: boolean;
    alwaysPauseOnInterruption?: boolean;
    notificationCapabilities?: $Values<typeof Capability>[];
    compactCapabilities?: $Values<typeof Capability>[];
    icon?: ResourceObject;
    playIcon?: ResourceObject;
    pauseIcon?: ResourceObject;
    stopIcon?: ResourceObject;
    previousIcon?: ResourceObject;
    nextIcon?: ResourceObject;
    rewindIcon?: ResourceObject;
    forwardIcon?: ResourceObject;
    color?: number;
  }
  declare export var Event: {|
    +PlaybackState: 'playback-state', // "playback-state"
    +PlaybackError: 'playback-error', // "playback-error"
    +PlaybackQueueEnded: 'playback-queue-ended', // "playback-queue-ended"
    +PlaybackTrackChanged: 'playback-track-changed', // "playback-track-changed"
    +PlaybackMetadataReceived: 'playback-metadata-received', // "playback-metadata-received"
    +RemotePlay: 'remote-play', // "remote-play"
    +RemotePlayId: 'remote-play-id', // "remote-play-id"
    +RemotePlaySearch: 'remote-play-search', // "remote-play-search"
    +RemotePause: 'remote-pause', // "remote-pause"
    +RemoteStop: 'remote-stop', // "remote-stop"
    +RemoteSkip: 'remote-skip', // "remote-skip"
    +RemoteNext: 'remote-next', // "remote-next"
    +RemotePrevious: 'remote-previous', // "remote-previous"
    +RemoteJumpForward: 'remote-jump-forward', // "remote-jump-forward"
    +RemoteJumpBackward: 'remote-jump-backward', // "remote-jump-backward"
    +RemoteSeek: 'remote-seek', // "remote-seek"
    +RemoteSetRating: 'remote-set-rating', // "remote-set-rating"
    +RemoteDuck: 'remote-duck', // "remote-duck"
    +RemoteLike: 'remote-like', // "remote-like"
    +RemoteDislike: 'remote-dislike', // "remote-dislike"
    +RemoteBookmark: 'remote-bookmark', // "remote-bookmark"
  |};

  declare export var TrackType: {|
    +Default: 'default', // "default"
    +Dash: 'dash', // "dash"
    +HLS: 'hls', // "hls"
    +SmoothStreaming: 'smoothstreaming', // "smoothstreaming"
  |};

  declare export var RepeatMode: {|
    +Off: 0, // 0
    +Track: 1, // 1
    +Queue: 2, // 2
  |};

  declare export var PitchAlgorithm: {|
    +Linear: 0, // 0
    +Music: 1, // 1
    +Voice: 2, // 2
  |};

  declare export var State: {|
    +None: 0, // 0
    +Ready: 1, // 1
    +Playing: 2, // 2
    +Paused: 3, // 3
    +Stopped: 4, // 4
    +Buffering: 5, // 5
    +Connecting: 6, // 6
  |};
  declare interface TrackMetadataBase {
    title?: string;
    album?: string;
    artist?: string;
    duration?: number;
    artwork?: string | ResourceObject;
    description?: string;
    genre?: string;
    date?: string;
    rating?: number | boolean;
  }
  declare type NowPlayingMetadata = {
    elapsedTime?: number,
    ...
  } & TrackMetadataBase;
  declare type Track = {
    url: string | ResourceObject,
    type?: $Values<typeof TrackType>,
    userAgent?: string,
    contentType?: string,
    pitchAlgorithm?: $Values<typeof PitchAlgorithm>,
    [key: string]: any,
    ...
  } & TrackMetadataBase;
}

/**
 * We include stubs for each file inside this npm package in case you need to
 * require those files directly. Feel free to delete any files that aren't
 * needed.
 */
declare module 'react-native-track-player/lib/hooks' {
  declare module.exports: any;
}

declare module 'react-native-track-player/lib' {
  declare module.exports: any;
}

declare module 'react-native-track-player/lib/interfaces' {
  declare module.exports: any;
}

// Filename aliases
declare module 'react-native-track-player/lib/hooks.js' {
  declare module.exports: $Exports<'react-native-track-player/lib/hooks'>;
}
declare module 'react-native-track-player/lib/index' {
  declare module.exports: $Exports<'react-native-track-player/lib'>;
}
declare module 'react-native-track-player/lib/index.js' {
  declare module.exports: $Exports<'react-native-track-player/lib'>;
}
declare module 'react-native-track-player/lib/interfaces.js' {
  declare module.exports: $Exports<'react-native-track-player/lib/interfaces'>;
}