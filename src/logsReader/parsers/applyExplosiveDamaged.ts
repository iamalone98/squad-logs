import { TApplyExplosiveDamaged } from '../../types';

export const applyExplosiveDamaged = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQProjectile::)?ApplyExplosiveDamage\(\): HitActor=(\S+) DamageCauser=(\S+) DamageInstigator=(\S+) ExplosionLocation=V\((X=[\d\-.]+, Y=[\d\-.]+, Z=[\d\-.]+)\)/,
  );

  if (matches) {
    const data: TApplyExplosiveDamaged = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      name: matches[3],
      grenade: matches[4],
      controller: matches[5],
      locations: matches[6],
      event: 'APPLY_EXPLOSIVE_DAMAGED',
    };
    return data;
  }
  return null;
};
