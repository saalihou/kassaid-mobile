/**
 * @flow
 */
import React, {useMemo, useState} from 'react';
import {useProgress} from 'react-native-track-player';
import View from 'react-native-ui-lib/view';
import {StyleSheet} from 'react-native';
import {Card, Text, Dialog} from 'react-native-ui-lib';

import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';
import Reader from './Reader';

export type FloatingLyricsProps = {
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

const fontSizePerLocale = {
  fr: 18,
  en: 18,
  ar: 26,
  arSN: 26,
  frSN: 18,
};

const FloatingLyrics = ({
  kassida,
  variantIndex,
  lang = 'fr',
}: FloatingLyricsProps) => {
  const [expanded, setExpanded] = useState(false);
  const kassidaVariant = kassida.variants[variantIndex];
  const progress = useProgress(1000);

  const transcriptionSegments = kassidaVariant.transcriptionSegments[lang];

  const secondsToSegmentIndexer = useMemo(
    () =>
      transcriptionSegments
        ? [...new Array(kassidaVariant.duration)].map((_, second) =>
            transcriptionSegments.find(
              segment =>
                second >= segment.timestamp.start &&
                second <= segment.timestamp.end,
            ),
          )
        : null,
    [transcriptionSegments, kassidaVariant],
  );

  if (!transcriptionSegments || !secondsToSegmentIndexer) {
    return null;
  }

  const currentSegment = secondsToSegmentIndexer[Math.round(progress.position)];
  const segmentContent =
    currentSegment && kassida.content[lang] && currentSegment.contentRef
      ? kassida.content[lang]
          .split('\n')
          .slice(
            // Start and end lines are indexed from 1
            currentSegment.contentRef.start - 1,
            currentSegment.contentRef.end,
          )
          .join('\n')
      : 'Pas de transcription disponible';

  return (
    <Card
      enableShadow
      elevation={20}
      padding-20
      marginB-20
      onPress={() => setExpanded(true)}>
      <View style={styles.floatingLyrics} row center>
        <Text
          center
          text30
          style={[
            styles.lyricsContent,
            {
              fontSize: fontSizePerLocale[lang] || 16,
              lineHeight: (fontSizePerLocale[lang] || 16) * 1.2,
            },
          ]}>
          {segmentContent}
        </Text>
      </View>
      <Text text80BL grey50>
        {localeLabels[lang]}
      </Text>
      <Dialog visible={expanded} onDismiss={() => setExpanded(false)}>
        <Reader kassida={kassida} lang={lang} />
      </Dialog>
    </Card>
  );
};

const styles = StyleSheet.create({
  floatingLyrics: {
    justifyContent: 'center',
    height: 150,
  },
  lyricsContent: {
    width: '90%',
    fontSize: 16,
  },
});

export default FloatingLyrics;
