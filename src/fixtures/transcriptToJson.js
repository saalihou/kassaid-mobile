const fs = require('fs');
const {flatten} = require('lodash');

const transcriptContent = fs.readFileSync(process.argv[2], 'utf8').trim();

const segmentStrings = transcriptContent.split('\n\n');

const content = flatten(
  segmentStrings.map(segmentString => segmentString.split('\n').slice(2)),
)
  .map(line => line.trim())
  .join('\n');

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

  const contentString = segmentString
    .split('\n')
    .slice(2)
    .map(line => line.trim())
    .join('\n');

  const locale = segmentString.split('\n')[1].trim();
  const contentRef = {
    locale,
    start: content.indexOf(contentString),
    end: content.indexOf(contentString) + contentString.length - 1,
  };

  return {
    timestamp,
    contentRef,
  };
});

console.log(
  JSON.stringify({
    content,
    transcriptions,
  }),
);
