export type TRoundWinner = {
  raw: string;
  time: string;
  chainID: string;
  winner: string;
  layer: string;
  event: string;
};

export const roundWinner = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQGameMode::)?DetermineMatchWinner\(\): (.+) won on (.+)/,
  );

  if (matches) {
    const data: TRoundWinner = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      winner: matches[3],
      layer: matches[4],
      event: 'ROUND_WINNER',
    };

    return data;
  }

  return null;
};
