import React from 'react';
import {Button, Card, Colors, Text} from 'react-native-ui-lib';
import {Locale} from '../../types/common/Locale';
import {Kassida} from '../../types/kassida/Kassida';
import {sortBy} from 'lodash';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from 'react-native';

type KassidaLineDetailsProps = {
  kassida: Kassida;
  lineNumbers: number[];
  langs: Locale[];
};

const KassidaLineDetails = ({
  kassida,
  lineNumbers,
  langs,
}: KassidaLineDetailsProps) => {
  const langPriority: Locale[] = ['ar', 'arSN', 'frSN', 'fr', 'en'];

  const sortedLangs = sortBy(langs, lang => langPriority.indexOf(lang));

  const text = sortedLangs
    .map(lang => {
      const kassidaContentByLine = kassida.content[lang]?.split('\n');
      const langText = lineNumbers
        .map(lineNumber => kassidaContentByLine?.[lineNumber])
        .filter(Boolean)
        .join('\n');
      return langText;
    })
    .join('\n\n');

  return (
    <Card padding={10}>
      <Text center marginB-10>
        {text}
      </Text>
      <Button
        label="Partager"
        onPress={() => {
          Share.open({
            title: kassida.name.fr,
            message: text,
          });
        }}>
        <Icon
          name="share"
          size={20}
          color={Colors.white}
          style={styles.shareIcon}
        />
      </Button>
    </Card>
  );
};

export default KassidaLineDetails;

const styles = StyleSheet.create({
  shareIcon: {
    marginRight: 5,
  },
});
