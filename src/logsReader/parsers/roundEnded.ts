import { LogsReaderEvents } from '../../events';
import { TRoundEnded } from '../../types';

export const roundEnded = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogGameState: Match State Changed from InProgress to WaitingPostMatch/,
  );

  if (matches) {
    const data: TRoundEnded = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      event: LogsReaderEvents.ROUND_ENDED,
    };

    return data;
  }

  return null;
};
