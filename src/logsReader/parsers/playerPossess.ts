export type TPlayerPossess = {
  raw: string;
  time: string;
  chainID: string;
  playerSuffix: string;
  playerEOSID: string;
  playerSteamID:string;
  possessClassname:string;
  pawn:string;
  event: string;
};

export const playerPossess = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQPlayerController::)?OnPossess\(\): PC=(.+) \(Online IDs: EOS: ([\w\d]{32}) steam: (\d{17})\) Pawn=([A-z0-9_]+)_C/,
  );

  if (matches) {
    const data: TPlayerPossess = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      playerSuffix: matches[3],
      playerEOSID: matches[4],
      playerSteamID: matches[5],
      possessClassname: matches[6],
      pawn: matches[5],
      event: 'PLAYER_POSSESS',
    };

    return data;
  }

  return null;
};
