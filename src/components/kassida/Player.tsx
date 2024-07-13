import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Text from 'react-native-ui-lib/text';
import View from 'react-native-ui-lib/view';
import Card from 'react-native-ui-lib/card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {State} from 'react-native-track-player';
import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';
import PlayerProgress from './PlayerProgress';
import {Button, ButtonSize, Colors} from 'react-native-ui-lib';
export type PlayerProps = {
  kassida: Kassida;
  variantIndex: number;
  lang?: Locale;
  onPlay?: () => void;
  onPause?: () => void;
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
      <View>
        <Card.Section
          imageSource={{
            uri: variant.preview.url,
          }}
          imageStyle={styles.cardImage}
        />
        <Text center text90T>
          {variant.name[lang]}
        </Text>
      </View>
      <View centerH flex spread paddingV-5>
        <View row style={styles.buttonsContainer}>
          <Button
            outline
            outlineWidth={0}
            round
            size={ButtonSize.xSmall}
            onPress={previous}>
            <Icon name={'skip-previous'} size={20} color={Colors.primary} />
          </Button>
          <Button
            onPress={playPause}
            round
            size={ButtonSize.large}
            style={styles.playButton}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={40}
              color="white"
            />
          </Button>
          <Button
            outline
            outlineWidth={0}
            round
            size={ButtonSize.xSmall}
            onPress={next}>
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
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  progressContainer: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  buttonsContainer: {
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    paddingTop: 5,
  },
  playButton: {
    width: 60,
    height: 60,
  },
});
export default Player;
