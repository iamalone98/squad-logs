import { LogsReaderEvents } from '../../events';
import { TPlayerRevived } from '../../types';

export const playerRevived = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: (.+) \(Online IDs: EOS: ([0-9a-f]{32}) steam: (\d{17})\) has revived (.+) \(Online IDs: EOS: ([0-9a-f]{32}) steam: (\d{17})\)\./,
  );

  if (matches) {
    const data: TPlayerRevived = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      reviverName: matches[3],
      reviverEOSID: matches[4],
      reviverSteamID: matches[5],
      victimName: matches[6],
      victimEOSID: matches[7],
      victimSteamID: matches[8],
      event: LogsReaderEvents.PLAYER_REVIVED,
    };

    return data;
  }

  return null;
};
