import { LogsReaderEvents } from '../../events';
import { TVehicleDamaged } from '../../types';

export const vehicleDamaged = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer]TraceAndMessageClient\(\): (.+): (.+) damage taken by causer (.+) instigator (.+) health remaining (.+)/,
  );

  if (matches) {
    const data: TVehicleDamaged = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      victimVehicle: matches[3],
      damage: parseFloat(matches[4]),
      attackerVehicle: matches[5],
      attackerName: matches[6],
      healthRemaining: matches[7],
      event: LogsReaderEvents.VEHICLE_DAMAGED,
    };

    return data;
  }

  return null;
};
