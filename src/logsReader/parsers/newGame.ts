export type TNewGame = {
  raw: string;
  time: string;
  chainID: string;
  dlc: string;
  mapClassname: string;
  layerClassname:string;
  event: string;
};

export const newGame = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogWorld: Bringing World \/([A-z]+)\/(?:Maps\/)?([A-z0-9-]+)\/(?:.+\/)?([A-z0-9-]+)(?:\.[A-z0-9-]+)/,
  );

  if (matches) {
    if (matches[5] === 'TransitionMap') return;
    
    const data: TNewGame = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      dlc: matches[3],
      mapClassname: matches[4],
      layerClassname: matches[5],
      event: 'NEW_GAME',
    };

    return data;
  }

  return null;
};
