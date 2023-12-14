export type TAdminBroadcast = {
  raw: string;
  time: string;
  chainID: string;
  message: string;
  from: string;
  event: string;
};

export const adminBroadcast = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: ADMIN COMMAND: Message broadcasted <(.+)> from (.+)/,
  );

  if (matches) {
    const data: TAdminBroadcast = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      message: matches[3],
      from: matches[4],
      event: 'ADMIN_BROADCAST',
    };

    return data;
  }

  return null;
};
