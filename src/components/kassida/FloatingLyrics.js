/**
 * @flow
 */
import React, {useMemo} from 'react';
import {useProgress} from 'react-native-track-player';
import View from 'react-native-ui-lib/view';
import Button from 'react-native-ui-lib/button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from 'react-native';
import {Card, Text, Colors} from 'react-native-ui-lib';
import TrackPlayer from 'react-native-track-player';

import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';

type FloatingLyricsProps = {
  kassida: Kassida,
  variantIndex: number,
  lang?: Locale,
};

const localeLabels = {
  fr: 'Français',
  ar: 'عرب',
  en: 'English',
  frSN: 'Wolof',
  arSN: 'ولوف',
};

const FloatingLyrics = ({
  kassida,
  variantIndex,
  lang = 'fr',
}: FloatingLyricsProps) => {
  const kassidaVariant = kassida.variants[variantIndex];
  const progress = useProgress(1000);
  const secondsToSegmentMap = useMemo(
    () =>
      [...new Array(kassidaVariant.duration)].map((_, second) =>
        kassidaVariant.transcriptionSegments.find(
          segment =>
            second >= segment.timestamp.start &&
            second <= segment.timestamp.end,
        ),
      ),
    [kassidaVariant],
  );
  const currentSegment = secondsToSegmentMap[Math.round(progress.position)];
  const segmentContent =
    currentSegment && kassida.content[lang] && currentSegment.contentRef[lang]
      ? kassida.content[lang].slice(
          currentSegment.contentRef[lang].start,
          currentSegment.contentRef[lang].end + 1,
        )
      : 'Pas de transcription disponible';

  const goToPreviousSegment = () => {
    const currentSegmentIndex =
      kassidaVariant.transcriptionSegments.indexOf(currentSegment);
    const previousSegmentIndex =
      currentSegmentIndex === 0
        ? 0
        : currentSegmentIndex === -1
        ? kassidaVariant.transcriptionSegments.length - 1
        : currentSegmentIndex - 1;
    const previousSegment =
      kassidaVariant.transcriptionSegments[previousSegmentIndex];
    if (previousSegment) {
      TrackPlayer.seekTo(previousSegment.timestamp.start);
    }
  };

  const goToNextSegment = () => {
    const currentSegmentIndex =
      kassidaVariant.transcriptionSegments.indexOf(currentSegment);
    if (
      currentSegmentIndex === -1 ||
      currentSegmentIndex === kassidaVariant.transcriptionSegments.length - 1
    ) {
      return;
    }
    const nextSegmentIndex = currentSegmentIndex + 1;
    const nextSegment = kassidaVariant.transcriptionSegments[nextSegmentIndex];
    if (nextSegment) {
      TrackPlayer.seekTo(nextSegment.timestamp.start);
    }
  };

  return (
    <Card enableShadow elevation={20} padding-20 marginB-20>
      <View style={styles.floatingLyrics} row center>
        <Button round outline onPress={goToPreviousSegment}>
          <Icon name="fast-rewind" color={Colors.primary} />
        </Button>
        <Text center text30 style={styles.lyricsContent}>
          {segmentContent}
        </Text>
        <Button round outline onPress={goToNextSegment}>
          <Icon name="fast-forward" color={Colors.primary} />
        </Button>
      </View>
      <Text text80BL grey50>
        {localeLabels[lang]}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  floatingLyrics: {
    justifyContent: 'center',
    height: 200,
  },
  lyricsContent: {
    width: '90%',
    fontSize: 20,
  },
});

export default FloatingLyrics;
