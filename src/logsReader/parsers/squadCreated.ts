import { LogsReaderEvents } from '../../events';
import { TSquadCreated } from '../../types';

export const squadCreated = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: (.+) \(Online IDs: EOS: ([0-9a-f]{32}) steam: (\d{17})\) has created Squad (\d+) \(Squad Name: (.+)\) on (.+)/,
  );

  if (matches) {
    const data: TSquadCreated = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      name: matches[3],
      eosID: matches[4],
      steamID: matches[5],
      squadID: matches[6],
      squadName: matches[7],
      teamName: matches[8],
      event: LogsReaderEvents.SQUAD_CREATED,
    };

    return data;
  }

  return null;
};
