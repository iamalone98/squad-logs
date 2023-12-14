export type TDeployableDamaged = {
  raw: string;
  time: string;
  chainID: string;
  deployable: string;
  damage: number;
  weapon: string;
  playerSuffix: string;
  damageType: string;
  healthRemaining: string;
  event: string;
};

export const deployableDamaged = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQDeployable::)?TakeDamage\(\): ([A-z0-9_]+)_C_[0-9]+: ([0-9.]+) damage attempt by causer ([A-z0-9_]+)_C_[0-9]+ instigator (.+) with damage type ([A-z0-9_]+)_C health remaining ([0-9.]+)/,
  );

  if (matches) {
    const data: TDeployableDamaged = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      deployable: matches[3],
      damage: parseFloat(matches[4]),
      weapon: matches[5],
      playerSuffix: matches[6],
      damageType: matches[7],
      healthRemaining: matches[8],
      event: 'DEPLOYABLE_DAMAGED',
    };

    return data;
  }

  return null;
};
