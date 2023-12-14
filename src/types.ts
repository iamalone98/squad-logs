export type TLogReaderOptions = {
  logEnabled?: boolean;
} & (TLogReaderLocalOptions | TLogReaderFTPOptions);

export type TLogReaderLocalOptions = {
  localFilePath: string;
};

export type TLogReaderFTPOptions = {
  host: string;
  username: string;
  password: string;
  remoteFilePath: string;
  timeout?: number;
};

export type TAdminBroadcast = {
  raw: string;
  time: string;
  chainID: string;
  message: string;
  from: string;
  event: string;
};

export type TNewGame = {
  raw: string;
  time: string;
  chainID: string;
  dlc: string;
  mapClassname: string;
  layerClassname: string;
  event: string;
};

export type TPlayerConnected = {
  raw: string;
  time: string;
  chainID: string;
  ip: string;
  eosID: string;
  steamID: string;
  event: string;
};

export type TPlayerDied = {
  raw: string;
  time: string;
  woundTime: string;
  chainID: string;
  victimName: string;
  damage: number;
  attackerPlayerController: string;
  attackerEOSID: string;
  attackerSteamID: string;
  weapon: string;
  event: string;
};

export type TPlayerDisconnected = {
  raw: string;
  time: string;
  chainID: string;
  steamID: string;
  playerController: string;
  event: string;
};

export type TPlayerPossess = {
  raw: string;
  time: string;
  chainID: string;
  name: string;
  eosID: string;
  steamID: string;
  possessClassname: string;
  pawn: string;
  event: string;
};

export type TPlayerRevived = {
  raw: string;
  time: string;
  chainID: string;
  reviverName: string;
  reviverEOSID: string;
  reviverSteamID: string;
  victimName: string;
  victimEOSID: string;
  victimSteamID: string;
  event: string;
};

export type TPlayerUnpossess = {
  raw: string;
  time: string;
  chainID: string;
  name: string;
  eosID: string;
  steamID: string;
  event: string;
};

export type TPlayerWounded = {
  raw: string;
  time: string;
  chainID: string;
  victimName: string;
  damage: number;
  attackerPlayerController: string;
  attackerEOSID: string;
  attackerSteamID: string;
  weapon: string;
  event: string;
};

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

export type TPlayerDamaged = {
  raw: string;
  time: string;
  chainID: string;
  victimName: string;
  damage: number;
  attackerName:string;
  attackerEOSID:string;
  attackerSteamID:string;
  attackerController:string;
  weapon:string;
  event: string;
};

export type TPlayerSuicide = {
  raw: string;
  time: string;
  chainID: string;
  playerSuffix: string;
  event: string;
};

export type TRoundEnded = {
  raw: string;
  time: string;
  chainID: string;
  event: string;
};

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

export type TRoundWinner = {
  raw: string;
  time: string;
  chainID: string;
  winner: string;
  layer: string;
  event: string;
};

export type TSquadCreated = {
  raw: string;
  time: string;
  chainID: string;
  playerName: string;
  playerSteamID: string;
  squadID: string;
  squadName: string;
  teamName: string;
  event: string;
};

export type TVehicleDamaged = {
  raw: string;
  time: string;
  chainID: string;
  victimVehicle: string;
  damage: number;
  attackerVehicle: string;
  attackerName: string;
  healthRemaining: string;
  event: string;
};