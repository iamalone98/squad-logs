import { TSquadCreated } from '../../types';

export const squadCreated = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: (.+) \(Steam ID: ([0-9]{17})\) has created Squad (\d+) \(Squad Name: (.+)\) on (.+)/,
  );

  if (matches) {
    const data: TSquadCreated = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      playerName: matches[3],
      playerSteamID: matches[4],
      squadID: matches[5],
      squadName: matches[6],
      teamName: matches[7],
      event: 'SQUAD_CREATED',
    };

    return data;
  }

  return null;
};
