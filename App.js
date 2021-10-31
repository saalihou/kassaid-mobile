/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import type {Node} from 'react';
import TrackPlayer from 'react-native-track-player';
import View from 'react-native-ui-lib/view';

import FloatingLyrics from './src/components/kassida/FloatingLyrics';
import Player from './src/components/kassida/Player';
const kassida = require('./src/fixtures/kassida.json');
var track = {
  url: kassida.variants[0].audio.url,
  title: kassida.name,
  artist: 'Cheikh Ahmadou Bamba',
  artwork: kassida.variants[0].preview.url,
  duration: 477, // Duration in seconds
};

TrackPlayer.setupPlayer({})
  .then(() => {
    TrackPlayer.add(track);
  })
  .catch(console.error);

const App: () => Node = () => {
  return (
    <View flex>
      <View flex backgroundColor="white" padding-10 spread>
        <FloatingLyrics kassida={kassida} variantIndex={0} lang="fr" />
        <FloatingLyrics kassida={kassida} variantIndex={0} lang="ar" />
        <Player kassida={kassida} variantIndex={0} />
      </View>
    </View>
  );
};

export default App;
