/**
 * @flow
 */

import type {TranslatedString} from '../common/TranslatedString';
import type {Locale} from '../common/Locale';

export type Kassida = {
  name: TranslatedString,
  content: TranslatedString,
  variants: Array<KasidaVariant>,
};

type KasidaVariant = {
  name: TranslatedString,
  audio: {
    url: string,
  },
  preview: {
    url: string,
  },
  duration: number,
  transcriptionSegments: [TranscriptionSegment],
};

type TranscriptionSegment = {
  contentRef: {
    [Locale]: {
      start: number,
      end: number,
    },
  },
  timestamp: {
    start: number,
    end: number,
  },
};
