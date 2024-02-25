import React, {useState, useEffect} from 'react';
import TrackPlayer, {Capability, Event} from 'react-native-track-player';
import View from 'react-native-ui-lib/view';

import SceneRenderer from './src/components/scenes/SceneRenderer';
import type {SceneConfig} from './src/components/scenes/SceneRenderer';
import {Button, Colors, Dialog} from 'react-native-ui-lib';
import KassidaSelector from './src/components/kassida/KassidaSelector';
import {Kassida} from './src/types/kassida/Kassida';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Locale} from './src/types/common/Locale';
import KassidaLineDetails from './src/components/kassida/KassidaLineDetails';
type Scene = {
  key: string;
  name: string;
  config: SceneConfig;
};
const scenes: Scene[] = [
  {
    key: 'AR_FR_TRANSCRIPTION',
    name: 'Français',
    config: {
      elements: [
        {
          key: 'SCENE_RENDERER',
          type: 'SCENE_RENDERER',
          props: {
            row: true,
            padded: false,
            sceneConfig: {
              elements: [
                {
                  key: 'FLOATING_LYRICS_FR',
                  type: 'FLOATING_LYRICS',
                  props: {
                    langs: ['fr', 'ar'],
                  },
                },
              ],
            },
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
    name: 'English',
    config: {
      elements: [
        {
          key: 'SCENE_RENDERER',
          type: 'SCENE_RENDERER',
          props: {
            row: true,
            padded: false,
            sceneConfig: {
              elements: [
                {
                  key: 'FLOATING_LYRICS_EN',
                  type: 'FLOATING_LYRICS',
                  props: {
                    langs: ['en', 'ar'],
                  },
                },
              ],
            },
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
    name: 'Wolofal',
    config: {
      elements: [
        {
          key: 'SCENE_RENDERER',
          type: 'SCENE_RENDERER',
          props: {
            row: true,
            padded: false,
            sceneConfig: {
              elements: [
                {
                  key: 'FLOATING_LYRICS_FRSN',
                  type: 'FLOATING_LYRICS',
                  props: {
                    langs: ['frSN', 'ar'],
                  },
                },
              ],
            },
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
    key: 'DURUS',
    name: 'Durus',
    config: {
      elements: [
        {
          key: 'FLOATING_LYRICS_AR',
          type: 'FLOATING_LYRICS',
          props: {
            langs: ['ar'],
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
const kassidas: Kassida[] = [
  require('./src/fixtures/matlabouchifai.json'),
  require('./src/fixtures/madalkhabirou.json'),
];
const tracks = kassidas.map(kassida => ({
  url: kassida.variants[0].audio.url,
  title: kassida.name.fr,
  artist: 'Cheikh Ahmadou Bamba',
  artwork: kassida.variants[0].preview.url,
  duration: kassida.variants[0].duration, // Duration in seconds
}));
TrackPlayer.setupPlayer({})
  .then(() => {
    TrackPlayer.add(tracks);
  })
  .catch(console.error);
TrackPlayer.updateOptions({
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.Stop,
  ],
  compactCapabilities: [Capability.Play, Capability.Pause],
});

const App = () => {
  const [selectedScene, setSelectedScene] = useState(scenes[0]);
  const [kassidaSelectorOpen, setKassidaSelectorOpen] = useState(false);
  const [selectedKassida, setSelectedKassida] = useState(kassidas[0]);
  const [lineDetailsOpen, setLineDetailsOpen] = useState(false);
  const [selectedLineNumbers, setSelectedLineNumbers] = useState<number[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<Locale[]>([]);

  useEffect(() => {
    async function skipToTrack() {
      const index = kassidas.indexOf(selectedKassida);

      if ((await TrackPlayer.getCurrentTrack()) !== index) {
        TrackPlayer.skip(index);
      }
    }

    skipToTrack();
  }, [selectedKassida]);
  useEffect(() => {
    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, data => {
      const nextTrack = data.nextTrack;

      if (nextTrack === null) {
        return;
      }

      setSelectedKassida(kassidas[nextTrack]);
    });
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View flex padding-5>
        <View row center padding-10 backgroundColor={Colors.white}>
          {scenes.map(scene => (
            <Button
              key={scene.key}
              onPress={() => {
                setSelectedScene(scene);
              }}
              label={scene.name}
              backgroundColor={
                selectedScene === scene ? Colors.primary : Colors.white
              }
              color={selectedScene === scene ? Colors.white : Colors.primary}
            />
          ))}
        </View>
        <Dialog
          visible={kassidaSelectorOpen}
          onDismiss={() => setKassidaSelectorOpen(false)}>
          <KassidaSelector
            kassidas={kassidas}
            onSelect={kassida => {
              setSelectedKassida(kassida);
              setKassidaSelectorOpen(false);
            }}
          />
        </Dialog>
        <Dialog
          visible={lineDetailsOpen}
          onDismiss={() => setLineDetailsOpen(false)}>
          <KassidaLineDetails
            kassida={selectedKassida}
            lineNumbers={selectedLineNumbers}
            langs={selectedLangs}
          />
        </Dialog>
        <SceneRenderer
          kassida={selectedKassida}
          variantIndex={0}
          sceneConfig={selectedScene.config}
          onTrackListOpen={() => setKassidaSelectorOpen(true)}
          onLinesClick={({lineNumbers, langs}) => {
            setSelectedLineNumbers(lineNumbers);
            setSelectedLangs(langs);
            setLineDetailsOpen(true);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

export default App;
