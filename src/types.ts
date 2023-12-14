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
