import React from 'react';
import {Picker} from 'react-native-ui-lib';
import {Kassida} from '../../types/kassida/Kassida';

type KassidaPickerProps = {
  kassidas: Kassida[];
  value: Kassida | null;
  onChange: (kassida: Kassida) => void;
};

const KassidaPicker = (props: KassidaPickerProps) => {
  const kassidaLabel = (kassida: Kassida) =>
    `${kassida.name.fr || ''} - ${kassida.name.ar || ''}`;

  return (
    <Picker
      value={props.value?.name.fr || ''}
      placeholder="Kassida"
      onChange={(item: {label: string; value: string}) => {
        const kassida = props.kassidas.find(k => k.name.fr === item.value);
        if (kassida) {
          props.onChange(kassida);
        }
      }}
      showSearch
      searchPlaceholder="Rechercher">
      {props.kassidas.map(kassida => (
        <Picker.Item
          key={kassida.name.fr}
          label={kassidaLabel(kassida)}
          value={kassida.name.fr || ''}
        />
      ))}
    </Picker>
  );
};

export default KassidaPicker;
