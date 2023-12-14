export type TPlayerDisconnected = {
  raw: string;
  time: string;
  chainID: string;
  steamID: string;
  playerController: string;
  event: string;
};

export const playerDisconnected = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogNet: UChannel::Close: Sending CloseBunch\. ChIndex == [0-9]+\. Name: \[UChannel\] ChIndex: [0-9]+, Closing: [0-9]+ \[UNetConnection\] RemoteAddr: ([0-9]{17}):[0-9]+, Name: SteamNetConnection_[0-9]+, Driver: GameNetDriver SteamNetDriver_[0-9]+, IsServer: YES, PC: ([^ ]+PlayerController_C_[0-9]+), Owner: [^ ]+PlayerController_C_[0-9]+/,
  );

  if (matches) {
    const data: TPlayerDisconnected = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      steamID: matches[3],
      playerController: matches[4],
      event: 'PLAYER_DISCONNECTED',
    };

    return data;
  }

  return null;
};
