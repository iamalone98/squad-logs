import { TPlayerPossess } from '../../types';

export const playerPossess = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQPlayerController::)?OnPossess\(\): PC=(.+) \(Online IDs: EOS: ([\w\d]{32}) steam: (\d{17})\) Pawn=([A-z0-9_]+)_C/,
  );

  if (matches) {
    const data: TPlayerPossess = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      name: matches[3],
      eosID: matches[4],
      steamID: matches[5],
      possessClassname: matches[6],
      pawn: matches[5],
      event: 'PLAYER_POSSESS',
    };

    return data;
  }

  return null;
};
