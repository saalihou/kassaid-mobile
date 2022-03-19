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
import {Colors, TouchableOpacity} from 'react-native-ui-lib';

export type PlayerProps = {
  kassida: Kassida,
  variantIndex: number,
  lang?: Locale,
  onPlay?: () => void,
  onPause?: () => void,
  onNamePress: () => void,
};

const Player = ({
  kassida,
  variantIndex,
  lang = 'fr',
  onPause,
  onPlay,
  onNamePress,
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

  const previous = () => {
    TrackPlayer.skipToPrevious();
  };

  const next = () => {
    TrackPlayer.skipToNext();
  };

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
        <TouchableOpacity onPress={onNamePress}>
          <Text center text50>
            {kassida.name[lang]}
          </Text>
        </TouchableOpacity>
        <Text center text90T>
          {variant.name[lang]}
        </Text>
        <View row style={styles.buttonsContainer}>
          <Button outline size="xSmall" onPress={previous}>
            <Icon name={'skip-previous'} size={16} color={Colors.primary} />
          </Button>
          <Button onPress={playPause}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={20}
              color="white"
            />
          </Button>
          <Button outline size="xSmall" onPress={next}>
            <Icon name={'skip-next'} size={20} color={Colors.primary} />
          </Button>
        </View>
        <View style={styles.progressContainer}>
          <PlayerProgress />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardImage: {width: 100, height: 100, resizeMode: 'cover'},
  progressContainer: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
  buttonsContainer: {
    justifyContent: 'space-around',
    alignSelf: 'stretch',
  },
});

export default Player;
