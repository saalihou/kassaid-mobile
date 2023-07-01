import React, {useMemo, useState, useEffect, useRef} from 'react';
import {State, usePlaybackState, useProgress} from 'react-native-track-player';
import {StyleSheet, Platform, UIManager, Animated, Easing} from 'react-native';
import {Card, Text, Dialog, Colors, View} from 'react-native-ui-lib';
import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';
import Reader from './Reader';
import {ScrollView} from 'react-native-gesture-handler';
import {sum} from 'lodash';
export type FloatingLyricsProps = {
  kassida: Kassida;
  variantIndex: number;
  lang?: Locale;
};
const fontSizePerLocale = {
  fr: 10,
  en: 11,
  ar: 18,
  arSN: 10,
  frSN: 13,
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
  const [scrollHeight, setScrollHeight] = useState(0);
  const segmentHeightsRef = useRef<number[]>([]);

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
        const currentSegmentIndex = Math.floor(
          (progress.position / progress.duration) *
            kassidaTextLinesByTwo.length,
        );
        const targetHeight = sum(
          segmentHeightsRef.current.slice(
            0,
            Math.max(currentSegmentIndex - 1, 0),
          ),
        );
        console.log(
          'currentSegmeentIndex',
          currentSegmentIndex,
          'targetHeight',
          targetHeight,
        );
        Animated.timing(scrollAnimation.current, {
          toValue: targetHeight,
          duration: (progress.duration / kassidaTextLinesByTwo.length) * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();
      }
    } else {
      scrollAnimation.current.stopAnimation();
    }
    const scrollAnimationCurrent = scrollAnimation.current;
    return () => scrollAnimationCurrent.removeAllListeners();
  }, [
    contentHeight,
    progress.duration,
    progress.position,
    scrollHeight,
    kassidaTextLinesByTwo,
    playbackState,
  ]);

  if (!transcriptionSegments || !secondsToSegmentIndexer) {
    return null;
  }

  return (
    <Card
      enableShadow
      elevation={20}
      // padding-20
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
        onLayout={event => {
          setScrollHeight(event.nativeEvent.layout.height);
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
          <View
            key={index}
            onLayout={event => {
              // expand the array if needed to a length of index
              if (segmentHeightsRef.current.length <= index) {
                segmentHeightsRef.current = [
                  ...segmentHeightsRef.current,
                  ...new Array(index - segmentHeightsRef.current.length + 1),
                ];
              }
              segmentHeightsRef.current[index] =
                event.nativeEvent.layout.height;
              console.log(lang, segmentHeightsRef.current);
            }}>
            <Text
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
          </View>
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
