/**
 * @flow
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, ListItem, Text, View} from 'react-native-ui-lib';

import type {Kassida} from '../../types/kassida/Kassida';

type KassidaSelectorProps = {
  kassidas: Kassida[],
  onSelect: (kassida: Kassida) => void,
};

const KassidaSelector = ({kassidas, onSelect}: KassidaSelectorProps) => {
  return (
    <Card padding={10}>
      {kassidas.map(kassida => (
        <ListItem
          key={kassida.name.fr}
          onPress={() => onSelect(kassida)}
          style={styles.listItem}>
          <View style={styles.nameContainer}>
            <Text text60>{kassida.name.fr}</Text>
          </View>
          <View>
            <Text>{kassida.variants[0].name.fr}</Text>
          </View>
        </ListItem>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
  },
});

export default KassidaSelector;
