/**
 * @flow
 */
import React from 'react';
import Slider from 'react-native-ui-lib/slider';
import {useProgress} from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';

type PlayerProgressProps = {};

const PlayerProgress = ({}: PlayerProgressProps) => {
  const progress = useProgress();

  return (
    <View row center>
      <Text>{secondsToTime(progress.position)}</Text>
      <View flex paddingH-5>
        <Slider
          flex
          maximumValue={progress.duration || 1}
          value={progress.position || 0}
          onValueChange={value => TrackPlayer.seekTo(value)}
        />
      </View>
      <Text>{secondsToTime(progress.duration)}</Text>
    </View>
  );
};

const secondsToTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${
    remainingSeconds <= 9 ? `0${remainingSeconds}` : remainingSeconds
  }`;
};

export default PlayerProgress;
