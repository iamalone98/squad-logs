import { LogsReaderEvents } from '../../events';
import { TApplyExplosiveDamage } from '../../types';

export const applyExplosiveDamage = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQProjectile::)?ApplyExplosiveDamage\(\): HitActor=(\S+) DamageCauser=(\S+) DamageInstigator=(\S+) ExplosionLocation=V\((X=[\d\-.]+, Y=[\d\-.]+, Z=[\d\-.]+)\)/,
  );

  if (matches) {
    const data: TApplyExplosiveDamage = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      name: matches[3],
      deployable: matches[4],
      playerController: matches[5],
      locations: matches[6],
      event: LogsReaderEvents.EXPLOSIVE_DAMAGED,
    };

    return data;
  }

  return null;
};
