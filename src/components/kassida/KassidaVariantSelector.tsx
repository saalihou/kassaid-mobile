import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, GridList, GridListItem, Spacings} from 'react-native-ui-lib';
import type {Kassida} from '../../types/kassida/Kassida';
type KassidaVariantSelectorProps = {
  kassida: Kassida;
  onSelect: (variant: Kassida['variants'][0]) => void;
};

const KassidaVariantSelector = ({
  kassida,
  onSelect,
}: KassidaVariantSelectorProps) => {
  const renderItem = ({item}: {item: Kassida['variants'][0]}) => {
    return (
      <GridListItem
        itemSize={{height: 100}}
        imageProps={{
          source: {uri: item.preview.url},
          style: {width: 100, height: 100},
          resizeMode: 'cover',
        }}
        title={item.name.fr}
        titleLines={2}
        onPress={() => onSelect(item)}
      />
    );
  };
  return (
    <Card>
      <GridList
        data={kassida.variants}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        itemSpacing={Spacings.s3}
        listPadding={Spacings.s5}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
});

export default KassidaVariantSelector;
