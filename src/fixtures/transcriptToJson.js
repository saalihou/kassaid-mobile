const fs = require('fs');
const {flatten, fromPairs} = require('lodash');

const transcriptContent = fs.readFileSync(process.argv[2], 'utf8').trim();

const segmentStrings = transcriptContent.split('\n\n');

const content = {};

const timeStringToSeconds = timeString => {
  const parts = timeString.split(':');
  if (parts.length === 1) {
    return parseInt(parts[0], 10);
  }
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
};

const transcriptions = segmentStrings.map(segmentString => {
  const timestampString = segmentString.split('\n')[0];
  const startString = timestampString.split(',')[0];
  const endString = timestampString.split(',')[1];

  const timestamp = {
    start: timeStringToSeconds(startString),
    end: timeStringToSeconds(endString),
  };

  const contentRef = {};

  let transcriptionMatch;
  const transcriptionRegex = /\[([a-zA-Z]+)\]\n([^[]+)/g;
  while ((transcriptionMatch = transcriptionRegex.exec(segmentString))) {
    const locale = transcriptionMatch[1];
    const subContent = transcriptionMatch[2];

    content[locale] = ((content[locale] || '') + subContent).trim() + '\n';
    contentRef[locale] = {
      start: content[locale].indexOf(subContent),
      end: content[locale].indexOf(subContent) + subContent.length - 1,
    };
  }

  return {
    timestamp,
    contentRef,
  };
});

console.log(
  JSON.stringify(
    {
      content,
      transcriptions,
    },
    null,
    2,
  ),
);
