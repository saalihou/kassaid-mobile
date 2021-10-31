/**
 * @flow
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import View from 'react-native-ui-lib/view';

import type {Kassida} from '../../types/kassida/Kassida';
import FloatingLyrics from '../kassida/FloatingLyrics';
import Player from '../kassida/Player';

export type SceneElementType = 'FLOATING_LYRICS' | 'PLAYER';

type SceneElement = {
  key: String,
  type: SceneElementType,
  props: Object,
};

type SceneConfig = {
  elements: SceneElement[],
};

type SceneProps = {
  kassida: Kassida,
  variantIndex: number,
  sceneConfig: SceneConfig,
};

const SceneRenderer = ({kassida, variantIndex, sceneConfig}: SceneProps) => {
  return (
    <View
      flex
      backgroundColor="white"
      padding-10
      spread={sceneConfig.elements.length > 2 ? true : false}
      center={sceneConfig.elements.length <= 2 ? true : false}
      style={styles.sceneRenderer}>
      {sceneConfig.elements.map(element => {
        if (element.type === 'FLOATING_LYRICS') {
          return (
            <FloatingLyrics
              key={element.key}
              kassida={kassida}
              variantIndex={0}
              lang={element.props.lang}
            />
          );
        }

        if (element.type === 'PLAYER') {
          return (
            <Player key={element.key} kassida={kassida} variantIndex={0} />
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({});

export default SceneRenderer;
