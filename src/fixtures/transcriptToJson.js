const fs = require('fs');
const transcriptContent = fs.readFileSync(process.argv[2], 'utf8').trim();

const segmentStrings = transcriptContent.split('\n');

const timeStringToSeconds = timeString => {
  const parts = timeString.split(':');
  if (parts.length === 1) {
    return parseInt(parts[0], 10);
  }
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
};

const transcriptionSegments = segmentStrings
  .map(segmentString => {
    if (!segmentString) {
      return null;
    }
    const transcriptionParts = /(\d+:\d+),(\d+:\d+) (\d+),(\d+)/.exec(
      segmentString,
    );

    if (!transcriptionParts) {
      throw new Error('Wrong format for segment string ' + segmentString);
    }

    return {
      timestamp: {
        start: timeStringToSeconds(transcriptionParts[1]),
        end: timeStringToSeconds(transcriptionParts[2]),
      },
      contentRef: {
        start: parseInt(timeStringToSeconds(transcriptionParts[3]), 10),
        end: parseInt(timeStringToSeconds(transcriptionParts[4]), 10),
      },
    };
  })
  .filter(v => !!v);

console.log(JSON.stringify(transcriptionSegments, null, 2));
