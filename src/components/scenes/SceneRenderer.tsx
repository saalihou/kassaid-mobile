import React from 'react';
import {StyleSheet} from 'react-native';
import View from 'react-native-ui-lib/view';
import type {Kassida} from '../../types/kassida/Kassida';
import FloatingLyrics from '../kassida/FloatingLyrics';
import type {FloatingLyricsProps} from '../kassida/FloatingLyrics';
import Player from '../kassida/Player';
import type {PlayerProps} from '../kassida/Player';
export type SceneElementType = 'FLOATING_LYRICS' | 'PLAYER';
type FloatingLyricsSceneElement = {
  key: string;
  type: 'FLOATING_LYRICS';
  props?: Omit<FloatingLyricsProps, 'kassida' | 'variantIndex'>;
};
type PlayerSceneElement = {
  key: string;
  type: 'PLAYER';
  props?: Omit<PlayerProps, 'kassida' | 'variantIndex' | 'onNamePress'>;
};
type SceneRendererElement = {
  key: string;
  type: 'SCENE_RENDERER';
  props: Omit<
    SceneRendererProps,
    'kassida' | 'variantIndex' | 'onTrackListOpen'
  >;
};
type SceneElement =
  | FloatingLyricsSceneElement
  | PlayerSceneElement
  | SceneRendererElement;
export type SceneConfig = {
  elements: SceneElement[];
};
type SceneRendererProps = {
  kassida: Kassida;
  variantIndex: number;
  sceneConfig: SceneConfig;
  row?: boolean;
  padded?: boolean;
  onTrackListOpen: () => void;
};

const SceneRenderer = ({
  kassida,
  sceneConfig,
  row,
  padded,
  onTrackListOpen,
}: SceneRendererProps) => {
  return (
    <View
      flex
      backgroundColor="white"
      padding-10={padded}
      row={row}
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
              {...element.props}
            />
          );
        }

        if (element.type === 'PLAYER') {
          return (
            <Player
              key={element.key}
              kassida={kassida}
              variantIndex={0}
              onNamePress={onTrackListOpen}
              {...element.props}
            />
          );
        }

        if (element.type === 'SCENE_RENDERER') {
          return (
            <SceneRenderer
              key={element.key}
              kassida={kassida}
              variantIndex={0}
              onTrackListOpen={onTrackListOpen}
              {...element.props}
            />
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sceneRenderer: {
    flexWrap: 'wrap',
  },
});
export default SceneRenderer;
