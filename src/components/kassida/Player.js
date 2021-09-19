/**
 * @flow
 */
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';
import Card from 'react-native-ui-lib/card';
import Button from 'react-native-ui-lib/button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {State} from 'react-native-track-player';

import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';
import PlayerProgress from './PlayerProgress';

type PlayerProps = {
  kassida: Kassida,
  variantIndex: number,
  lang?: Locale,
  onPlay?: () => void,
  onPause?: () => void,
};

const Player = ({
  kassida,
  variantIndex,
  lang = 'fr',
  onPause,
  onPlay,
}: PlayerProps) => {
  const variant = kassida.variants[variantIndex];
  const [isPlaying, setIsPlaying] = useState(false);

  const playPause = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
      setIsPlaying(false);
      if (onPause) {
        onPause();
      }
    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
      if (onPlay) {
        onPlay();
      }
    }
  }, [isPlaying, onPause, onPlay]);

  useEffect(() => {
    async function syncInitialIsPlaying() {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
    syncInitialIsPlaying();
  }, []);

  return (
    <Card row>
      <Card.Section
        imageSource={{uri: variant.preview.url}}
        imageStyle={styles.cardImage}
      />
      <View centerH flex spread paddingV-5>
        <Text center text50>
          {kassida.name[lang]}
        </Text>
        <Text center text90T>
          {variant.name[lang]}
        </Text>
        <Button onPress={playPause}>
          <Icon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={20}
            color="white"
          />
        </Button>
        <View style={styles.progressContainer}>
          <PlayerProgress />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardImage: {width: 150, height: 150, resizeMode: 'cover'},
  progressContainer: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
});

export default Player;
