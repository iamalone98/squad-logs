import { LogsReaderEvents } from '../../events';
import { TPlayerUnpossess } from '../../types';

export const playerUnpossess = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQPlayerController::)?OnUnPossess\(\): PC=(.+) \(Online IDs: EOS: ([\w\d]{32}) steam: (\d{17})\)/,
  );

  if (matches) {
    const data: TPlayerUnpossess = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      name: matches[3],
      eosID: matches[4],
      steamID: matches[5],
      event: LogsReaderEvents.PLAYER_UNPOSSESS,
    };

    return data;
  }

  return null;
};
