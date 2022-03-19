/**
 * @flow
 */
import React from 'react';
import {Card, Colors, Text, View} from 'react-native-ui-lib';
import {ScrollView, StyleSheet} from 'react-native';
import chunk from 'lodash/chunk';

import type {Kassida} from '../../types/kassida/Kassida';
import type {Locale} from '../../types/common/Locale';

type ReaderProps = {
  kassida: Kassida,
  lang: Locale,
};

const alignmentByLang = {
  fr: 'left',
  en: 'left',
  ar: 'right',
  frSN: 'right',
  arSN: 'right',
};

const Reader = ({kassida, lang}: ReaderProps) => {
  const content = kassida.content[lang];
  if (!content) {
    return null;
  }
  const verses = chunk(content.split('\n'), 2);
  return (
    <Card style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {verses.map((verse, index) => (
          <View
            style={[
              styles.verseContainer,
              index % 2 === 0
                ? styles.evenVerseContainer
                : styles.oddVerseContainer,
            ]}
            key={index}>
            <Text
              style={[
                styles.content,
                {
                  textAlign: alignmentByLang[lang] || 'left',
                },
              ]}>
              {verse.join('\n')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    marginHorizontal: 20,
    borderStyle: 'dotted',
    borderColor: Colors.black,
    borderWidth: 5,
    borderRadius: 1,
  },
  contentContainer: {},
  verseContainer: {
    padding: 20,
  },
  evenVerseContainer: {
    backgroundColor: '#dbcc9a',
  },
  oddVerseContainer: {
    backgroundColor: '#FFFEE1',
  },
  content: {
    fontSize: 20,
  },
});

export default Reader;
