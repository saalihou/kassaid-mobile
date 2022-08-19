import React, {useState, useEffect} from 'react';
import TrackPlayer, {Capability, Event} from 'react-native-track-player';
import View from 'react-native-ui-lib/view';
import SceneRenderer from './src/components/scenes/SceneRenderer';
import type {SceneConfig} from './src/components/scenes/SceneRenderer';
import {Button, Colors, Dialog} from 'react-native-ui-lib';
import KassidaSelector from './src/components/kassida/KassidaSelector';
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
    name: 'English',
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
    name: 'Wolofal',
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
const kassidas = [
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
    <View flex>
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
      <SceneRenderer
        kassida={selectedKassida}
        variantIndex={0}
        sceneConfig={selectedScene.config}
        onTrackListOpen={() => setKassidaSelectorOpen(true)}
      />
    </View>
  );
};

export default App;
