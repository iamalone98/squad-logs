import { TPlayerSuicide } from '../../types';

export const playerSuicide = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: Warning: Suicide (.+)/,
  );

  if (matches) {
    const data: TPlayerSuicide = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      playerSuffix: matches[3],
      event: 'PLAYER_SUICIDE',
    };

    return data;
  }

  return null;
};
