import type {TranslatedString} from '../common/TranslatedString';
export type Kassida = {
  name: TranslatedString;
  content: TranslatedString;
  variants: Array<KasidaVariant>;
};
type KasidaVariant = {
  name: TranslatedString;
  audio: {
    url: string;
  };
  preview: {
    url: string;
  };
  duration: number;
  transcriptionSegments: {
    fr?: Array<TranscriptionSegment>;
    ar?: Array<TranscriptionSegment>;
    en?: Array<TranscriptionSegment>;
    frSN?: Array<TranscriptionSegment>;
    arSN?: Array<TranscriptionSegment>;
  };
};
export type TranscriptionSegment = {
  contentRef: {
    start: number;
    end: number;
  };
  timestamp: {
    start: number;
    end: number;
  };
};
