export type TRoundTickets = {
  raw: string;
  time: string;
  chainID: string;
  team: string;
  subfaction: string;
  faction: string;
  action: string;
  tickets: string;
  layer: string;
  level: string;
  event: string;
};

export const roundTickets = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadGameEvents: Display: Team ([0-9]), (.*) \( ?(.*?) ?\) has (won|lost) the match with ([0-9]+) Tickets on layer (.*) \(level (.*)\)!/,
  );

  if (matches) {
    const data: TRoundTickets = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      team: matches[3],
      subfaction: matches[4],
      faction: matches[5],
      action: matches[6],
      tickets: matches[7],
      layer: matches[8],
      level: matches[9],
      event: 'ROUND_TICKETS',
    };

    return data;
  }

  return null;
};
