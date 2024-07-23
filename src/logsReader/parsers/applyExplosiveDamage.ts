import { LogsReaderEvents } from '../../events';
import { TApplyExplosiveDamage } from '../../types';

export const applyExplosiveDamage = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQProjectile::)?ApplyExplosiveDamage\(\): HitActor=.+ DamageCauser=(.+) DamageInstigator=BP_PlayerController_C_(.+) ExplosionLocation=V\(X=.+, Y=.+, Z=.+)/,
  );

  if (matches) {
    const data: TApplyExplosiveDamage = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      deployable: matches[3],
      playerController: matches[4],
      event: LogsReaderEvents.EXPLOSIVE_DAMAGED,
    };

    return data;
  }

  return null;
};
