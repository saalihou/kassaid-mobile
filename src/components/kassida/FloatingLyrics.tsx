import React, {useMemo, useState, useEffect, useRef} from 'react';
import {State, usePlaybackState, useProgress} from 'react-native-track-player';
import {StyleSheet, Platform, UIManager, Animated, Easing} from 'react-native';
import {Card, Text, Dialog, Colors} from 'react-native-ui-lib';
import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';
import Reader from './Reader';
import {ScrollView} from 'react-native-gesture-handler';
export type FloatingLyricsProps = {
  kassida: Kassida;
  variantIndex: number;
  lang?: Locale;
};
const fontSizePerLocale = {
  fr: 18,
  en: 18,
  ar: 26,
  arSN: 26,
  frSN: 18,
};

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FloatingLyrics = ({
  kassida,
  variantIndex,
  lang = 'fr',
}: FloatingLyricsProps) => {
  const [expanded, setExpanded] = useState(false);
  const kassidaVariant = kassida.variants[variantIndex];
  const progress = useProgress(1000);
  const playbackState = usePlaybackState();
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

  // const y = useRef(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollAnimation = useRef<Animated.Value>(new Animated.Value(0));
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const startDelayPercentage =
      (kassidaVariant.transcriptionStartDelay || 0) / kassidaVariant.duration;
    const startDelayOffset = startDelayPercentage * contentHeight;
    scrollAnimation.current.setValue(-startDelayOffset);
  }, [
    kassidaVariant.transcriptionStartDelay,
    kassidaVariant.duration,
    contentHeight,
  ]);

  const kassidaText = kassida.content[lang];
  const kassidaTextLinesByTwo = useMemo(() => {
    const kassidaTextLines = kassidaText?.split('\n') || [];
    const linesByTwo = [];
    for (let i = 0; i < kassidaTextLines.length; i += 2) {
      linesByTwo.push(kassidaTextLines.slice(i, i + 2).join('\n'));
    }
    return linesByTwo;
  }, [kassidaText]);

  useEffect(() => {
    if (playbackState === State.Playing) {
      scrollAnimation.current.addListener(animation => {
        scrollRef.current &&
          scrollRef.current.scrollTo({
            y: Math.max(animation.value, 0),
            animated: false,
          });
      });

      if (contentHeight && progress.duration) {
        Animated.timing(scrollAnimation.current, {
          toValue: contentHeight,
          duration: progress.duration * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();
      }
    } else {
      scrollAnimation.current.stopAnimation();
    }
    const scrollAnimationCurrent = scrollAnimation.current;
    return () => scrollAnimationCurrent.removeAllListeners();
  }, [contentHeight, progress.duration, playbackState]);

  if (!transcriptionSegments || !secondsToSegmentIndexer) {
    return null;
  }

  return (
    <Card
      enableShadow
      elevation={20}
      padding-20
      paddingT-10
      marginB-20
      flex
      // onPress={() => setExpanded(true)}
    >
      <Animated.ScrollView
        ref={scrollRef}
        onContentSizeChange={(width, height) => {
          setContentHeight(height);
        }}
        onScrollBeginDrag={() => scrollAnimation.current.stopAnimation()}
        onScrollEndDrag={event => {
          scrollAnimation.current.setValue(event.nativeEvent.contentOffset.y);
          Animated.timing(scrollAnimation.current, {
            toValue: contentHeight,
            duration: progress.duration * 1000 - progress.position * 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }).start();
        }}
        style={styles.floatingLyrics}
        contentContainerStyle={styles.floatingLyricsContent}>
        {kassidaTextLinesByTwo.map((line, index) => (
          <Text
            key={index}
            center
            text30
            style={[
              styles.lyricsContent,
              {
                fontSize: fontSizePerLocale[lang] || 16,
                lineHeight: (fontSizePerLocale[lang] || 16) * 1.2,
              },

              index % 2 === 0
                ? styles.evenFloatingLyricsContent
                : styles.oddFloatingLyricsContent,
            ]}>
            {line}
          </Text>
        ))}
      </Animated.ScrollView>
      <Dialog visible={expanded} onDismiss={() => setExpanded(false)}>
        <Reader kassida={kassida} lang={lang} />
      </Dialog>
    </Card>
  );
};

const styles = StyleSheet.create({
  floatingLyrics: {},
  floatingLyricsContent: {},
  lyricsContent: {
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 7.5,
    paddingBottom: 7.5,
  },
  evenFloatingLyricsContent: {
    backgroundColor: Colors.grey60,
  },
  oddFloatingLyricsContent: {
    backgroundColor: Colors.white,
  },
});

export default FloatingLyrics;
