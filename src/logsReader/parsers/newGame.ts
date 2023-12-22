import { LogsReaderEvents } from '../../events';
import { TNewGame } from '../../types';

export const newGame = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogWorld: Bringing World \/([A-z]+)\/(?:Maps\/)?([A-z0-9-]+)\/(?:.+\/)?([A-z0-9-]+)(?:\.[A-z0-9-]+)/,
  );

  if (matches) {
    const data: TNewGame = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      dlc: matches[3],
      mapClassname: matches[4],
      layerClassname: matches[5],
      event: LogsReaderEvents.NEW_GAME,
    };

    if (data.layerClassname.includes('Transition')) return null;
    return data;
  }

  return null;
};
