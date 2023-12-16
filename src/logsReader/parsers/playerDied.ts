import { LogsReaderEvents } from '../../events';
import { TPlayerDied } from '../../types';

export const playerDied = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQSoldier::)?Die\(\): Player:(.+) KillingDamage=(?:-)*([0-9.]+) from ([A-z_0-9]+) \(Online IDs: EOS: ([\w\d]{32}) steam: (\d{17}) \| Contoller ID: ([\w\d]+)\) caused by ([A-z_0-9-]+)_C/,
  );

  if (matches) {
    const data: TPlayerDied = {
      raw: matches[0],
      time: matches[1],
      woundTime: matches[1],
      chainID: matches[2],
      victimName: matches[3],
      damage: parseFloat(matches[4]),
      attackerPlayerController: matches[5],
      attackerEOSID: matches[6],
      attackerSteamID: matches[7],
      weapon: matches[9],
      event: LogsReaderEvents.PLAYER_DIED,
    };

    return data;
  }

  return null;
};
