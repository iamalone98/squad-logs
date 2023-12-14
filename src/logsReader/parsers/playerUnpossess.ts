export type TPlayerUnpossess = {
  raw: string;
  time: string;
  chainID: string;
  playerSuffix: string;
  playerEOSID: string;
  playerSteamID: string;
  event: string;
};

export const playerUnpossess = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQPlayerController::)?OnUnPossess\(\): PC=(.+) \(Online IDs: EOS: ([\w\d]{32}) steam: (\d{17})\)/,
  );

  if (matches) {
    const data: TPlayerUnpossess = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      playerSuffix: matches[3],
      playerEOSID: matches[4],
      playerSteamID: matches[5],
      event: 'PLAYER_UNPOSSESS',
    };

    return data;
  }

  return null;
};
