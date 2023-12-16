import { LogsReaderEvents } from '../../events';
import { TPlayerDamaged } from '../../types';

export const playerDamaged = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: Player:(.+) ActualDamage=([0-9.]+) from (.+) \(Online IDs: EOS: ([0-9a-f]{32}) steam: (\d{17}) \| Player Controller ID: ([^ ]+)\)caused by ([A-z_0-9-]+)_C/,
  );

  if (matches) {
    const data: TPlayerDamaged = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      victimName: matches[3],
      damage: parseFloat(matches[4]),
      attackerName: matches[5],
      attackerEOSID: matches[6],
      attackerSteamID: matches[7],
      attackerController: matches[8],
      weapon: matches[9],
      event: LogsReaderEvents.PLAYER_DAMAGED,
    };

    return data;
  }

  return null;
};
