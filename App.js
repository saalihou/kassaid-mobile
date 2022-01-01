/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';
import View from 'react-native-ui-lib/view';

import SceneRenderer from './src/components/scenes/SceneRenderer';
import {Picker} from '@react-native-picker/picker';
import {Colors} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';

const scenes = [
  {
    key: 'PLAYER_ONLY',
    name: 'Lecture Seule',
    config: {
      elements: [
        {
          key: 'PLAYER',
          type: 'PLAYER',
        },
      ],
    },
  },
  {
    key: 'AR_FR_TRANSCRIPTION',
    name: 'Transcription Arabe/Français',
    config: {
      elements: [
        {
          key: 'FLOATING_LYRICS_FR',
          type: 'FLOATING_LYRICS',
          props: {
            lang: 'fr',
          },
        },
        {
          key: 'FLOATING_LYRICS_AR',
          type: 'FLOATING_LYRICS',
          props: {
            lang: 'ar',
          },
        },
        {
          key: 'PLAYER',
          type: 'PLAYER',
        },
      ],
    },
  },
  {
    key: 'AR_EN_TRANSCRIPTION',
    name: 'Transcription Arabic/English',
    config: {
      elements: [
        {
          key: 'FLOATING_LYRICS_EN',
          type: 'FLOATING_LYRICS',
          props: {
            lang: 'en',
          },
        },
        {
          key: 'FLOATING_LYRICS_AR',
          type: 'FLOATING_LYRICS',
          props: {
            lang: 'ar',
          },
        },
        {
          key: 'PLAYER',
          type: 'PLAYER',
        },
      ],
    },
  },
  {
    key: 'FRSN_TRANSCRIPTION',
    name: 'Transcription Wolof',
    config: {
      elements: [
        {
          key: 'FLOATING_LYRICS_FRSN',
          type: 'FLOATING_LYRICS',
          props: {
            lang: 'frSN',
          },
        },
        {
          key: 'PLAYER',
          type: 'PLAYER',
        },
      ],
    },
  },
  {
    key: 'AR_TRANSCRIPTION',
    name: 'Transcription Arabe',
    config: {
      elements: [
        {
          key: 'FLOATING_LYRICS_AR',
          type: 'FLOATING_LYRICS',
          props: {
            lang: 'ar',
          },
        },
        {
          key: 'PLAYER',
          type: 'PLAYER',
        },
      ],
    },
  },
];

const kassida = require('./src/fixtures/kassida.json');
const track = {
  url: kassida.variants[0].audio.url,
  title: kassida.name.fr,
  artist: 'Cheikh Ahmadou Bamba',
  artwork: kassida.variants[0].preview.url,
  duration: 477, // Duration in seconds
};

TrackPlayer.setupPlayer({})
  .then(() => {
    TrackPlayer.add(track);
  })
  .catch(console.error);

TrackPlayer.updateOptions({
  stopWithApp: true,
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.Stop,
  ],
  compactCapabilities: [Capability.Play, Capability.Pause],
});

const App: () => Node = () => {
  const [selectedScene, setSelectedScene] = useState(scenes[1]);
  return (
    <View flex>
      <Picker
        placeholder="Scène"
        selectedValue={selectedScene.key}
        onValueChange={sceneKey => {
          const pickedScene = scenes.find(scene => scene.key === sceneKey);
          if (pickedScene) {
            setSelectedScene(pickedScene);
          }
        }}
        style={styles.scenePicker}
        dropdownIconColor={Colors.primary}>
        {scenes.map(scene => (
          <Picker.Item
            style={styles.scenePickerItem}
            key={scene.key}
            value={scene.key}
            label={scene.name}
          />
        ))}
      </Picker>
      <SceneRenderer
        kassida={kassida}
        variantIndex={0}
        sceneConfig={selectedScene.config}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scenePicker: {
    backgroundColor: Colors.white,
  },
  scenePickerItem: {
    color: Colors.black,
  },
});

export default App;
