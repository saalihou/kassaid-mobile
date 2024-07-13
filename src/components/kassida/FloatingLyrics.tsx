import React, {useMemo, useState, useEffect, useRef, useCallback} from 'react';
import TrackPlayer, {Event, State} from 'react-native-track-player';
import {
  StyleSheet,
  Platform,
  UIManager,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {Card, Text, Colors, View} from 'react-native-ui-lib';
import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';
import {ScrollView} from 'react-native-gesture-handler';
export type FloatingLyricsProps = {
  kassida: Kassida;
  variantIndex: number;
  langs?: Locale[];
  onLinesClick: (payload: {lineNumbers: number[]; langs: Locale[]}) => void;
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
  langs = [],
  onLinesClick,
}: FloatingLyricsProps) => {
  const kassidaVariant = kassida.variants[variantIndex];

  const scrollRef = useRef<ScrollView>(null);
  const scrollAnimation = useRef<Animated.Value>(new Animated.Value(0));
  const currentScrollValueRef = useRef(0);
  const [contentHeight, setContentHeight] = useState(0);
  const segmentHeightsRef = useRef<number[]>([]);

  useEffect(() => {
    const startDelayPercentage = kassidaVariant.transcriptionStartDelay
      ? (kassidaVariant.transcriptionStartDelay || 0) / kassidaVariant.duration
      : 0.1;
    const startDelayOffset = startDelayPercentage * contentHeight;
    scrollAnimation.current.setValue(-startDelayOffset);
  }, [
    kassidaVariant.transcriptionStartDelay,
    kassidaVariant.duration,
    contentHeight,
    variantIndex,
  ]);

  const kassidaTextLinesByTwo = useMemo(() => {
    return langs.map(lang => {
      const kassidaText = kassida.content[lang];
      const kassidaTextLines = kassidaText?.split('\n') || [];
      const linesByTwo = [];
      for (let i = 0; i < kassidaTextLines.length; i += 2) {
        linesByTwo.push(kassidaTextLines.slice(i, i + 2).join('\n'));
      }
      return linesByTwo;
    });
  }, [kassida.content, langs]);

  const startAutoScrolling = useCallback(async () => {
    if ((await TrackPlayer.getState()) !== State.Playing) {
      return;
    }
    console.debug('startAutoScrolling');
    scrollAnimation.current.addListener(animation => {
      currentScrollValueRef.current = animation.value;
      scrollRef.current &&
        scrollRef.current.scrollTo({
          y: Math.max(animation.value, 0),
          animated: false,
        });
    });
    if (contentHeight) {
      Animated.timing(scrollAnimation.current, {
        toValue: contentHeight,
        duration:
          (await TrackPlayer.getDuration()) * 1000 -
          (await TrackPlayer.getPosition()) * 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    }
  }, [contentHeight]);

  const pauseAutoScrolling = useCallback(() => {
    console.debug('pauseAutoScrolling');
    scrollAnimation.current.stopAnimation();
    if (scrollAnimation.current.hasListeners()) {
      scrollAnimation.current.removeAllListeners();
      scrollRef.current?.scrollTo({
        y: currentScrollValueRef.current,
        animated: false,
      });
    }
  }, []);

  useEffect(() => {
    TrackPlayer.addEventListener(Event.PlaybackState, event => {
      if (event.state === State.Playing) {
        startAutoScrolling();
      } else {
        pauseAutoScrolling();
      }
    });
  }, [startAutoScrolling, pauseAutoScrolling]);

  useEffect(() => {
    async function initScrollValues() {
      scrollAnimation.current.setValue(
        ((await TrackPlayer.getPosition()) * 1000) /
          ((await TrackPlayer.getDuration()) * 1000),
      );
    }

    initScrollValues();
  }, [langs]);

  const isMomentumScrolling = useRef(false);

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
        onScrollBeginDrag={() => {
          pauseAutoScrolling();
        }}
        onMomentumScrollBegin={() => {
          console.debug('onMomentumScrollBegin');
          isMomentumScrolling.current = true;
          pauseAutoScrolling();
        }}
        onScrollEndDrag={event => {
          const nativeEvent = event.nativeEvent;
          setTimeout(() => {
            console.debug('onScrollEndDrag', isMomentumScrolling.current);
            if (isMomentumScrolling.current) {
              return;
            }
            scrollAnimation.current.setValue(nativeEvent.contentOffset.y);
            startAutoScrolling();
          }, 10);
        }}
        onMomentumScrollEnd={event => {
          console.debug('onMomentumScrollEnd');
          isMomentumScrolling.current = false;
          scrollAnimation.current.setValue(event.nativeEvent.contentOffset.y);
          startAutoScrolling();
        }}
        style={styles.floatingLyrics}
        contentContainerStyle={styles.floatingLyricsContent}>
        {kassidaTextLinesByTwo[0].map((line, lineIndex) => (
          <TouchableOpacity
            onPressIn={() => {
              pauseAutoScrolling();
            }}
            onPress={() => {
              onLinesClick({
                lineNumbers: [lineIndex * 2, lineIndex * 2 + 1],
                langs,
              });
            }}
            key={lineIndex}>
            <View
              row
              spread
              style={
                lineIndex % 2 === 0
                  ? styles.evenFloatingLyricsContent
                  : styles.oddFloatingLyricsContent
              }
              onLayout={event => {
                // expand the array if needed to a length of index
                if (segmentHeightsRef.current.length <= lineIndex) {
                  segmentHeightsRef.current = [
                    ...segmentHeightsRef.current,
                    ...new Array(
                      lineIndex - segmentHeightsRef.current.length + 1,
                    ),
                  ];
                }
                segmentHeightsRef.current[lineIndex] =
                  event.nativeEvent.layout.height;
              }}>
              {langs.map((lang, langIndex) => {
                return (
                  <View flex key={lang}>
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
                      {kassidaTextLinesByTwo[langIndex][lineIndex]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
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
    // flex: 1,
  },
  evenFloatingLyricsContent: {
    backgroundColor: Colors.grey60,
  },
  oddFloatingLyricsContent: {
    backgroundColor: Colors.white,
  },
});

export default FloatingLyrics;
