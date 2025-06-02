import FTP from 'basic-ftp';
import EventEmitter from 'events';
import fs from 'fs';
import readline from 'readline';
import SFTPClient from 'ssh2-sftp-client';
import { Writable } from 'stream';
import { Tail } from 'tail';
import { initLogger } from '../logger';
import { TLogReaderOptions } from '../types';
import { parseLine } from './parsers';

export class LogsReader extends EventEmitter {
  id: number;
  filePath: string;
  adminsFilePath: string;
  readType: 'local' | 'remote';
  remoteType: 'SFTP' | 'FTP' | 'FTP-secure';
  autoReconnect: boolean;
  logger: ReturnType<typeof initLogger>;
  sftpConnected: boolean;
  ftpConnected: boolean;
  sftp?: SFTPClient;
  ftp?: FTP.Client;
  tail?: Tail;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  logEnabled?: boolean;
  timeout?: number;

  constructor(options: TLogReaderOptions) {
    super();

    for (const option of [
      'id',
      'filePath',
      'adminsFilePath',
      'readType',
      'autoReconnect',
    ])
      if (!(option in options))
        throw new Error(`${option} required!`);

    if (options.readType === 'remote') {
      for (const option of [
        'host',
        'username',
        'password',
        'remoteType',
      ])
        if (!(option in options))
          throw new Error(`${option} required for remote!`);
    }

    const {
      id,
      filePath,
      adminsFilePath,
      autoReconnect,
      readType,
      remoteType,
      host,
      username,
      password,
      logEnabled,
      timeout,
      port,
    } = options;

    this.id = id;
    this.filePath = filePath;
    this.adminsFilePath = adminsFilePath;
    this.autoReconnect = autoReconnect;
    this.readType = readType;
    this.remoteType = remoteType ?? 'SFTP';
    this.logEnabled = logEnabled;
    this.timeout = timeout;
    this.sftpConnected = false;
    this.ftpConnected = false;

    if (readType === 'remote') {
      this.host = host;
      this.port = port;
      this.username = username;
      this.password = password;
    }

    this.logger = initLogger(
      this.id,
      typeof options.logEnabled === 'undefined'
        ? true
        : options?.logEnabled,
    );

    this.setMaxListeners(20);
  }

  async init() {
    return new Promise((res) => {
      this.on('connected', () => res(true));

      switch (this.readType) {
        case 'local': {
          this.#localReader();
        }
        case 'remote': {
          switch (this.remoteType) {
            case 'SFTP': {
              this.#sftpReader();
            }
            case 'FTP': {
              this.#ftpReader(false);
            }
            case 'FTP-secure': {
              this.#ftpReader(true);
            }
            default: {
              this.#sftpReader();
            }
          }
        }
      }
    });
  }

  async getAdminsFile() {
    return new Promise<{
      [key in string]: { [key in string]: true };
    }>(async (resolve, reject) => {
      try {
        switch (this.readType) {
          case 'local': {
            if (!fs.existsSync(this.adminsFilePath))
              reject(`Not found admins file`);

            const data = this.#parseConfigUsers(
              fs.readFileSync(this.adminsFilePath, 'utf8'),
            );

            resolve(data);
          }
          case 'remote': {
            switch (this.remoteType) {
              case 'SFTP': {
                if (this.sftp && this.sftpConnected) {
                  const t = this.sftp.createReadStream(
                    this.adminsFilePath,
                  );

                  const chunks: Buffer[] = [];

                  for await (const chunk of t) {
                    chunks.push(Buffer.from(chunk));
                  }

                  const data = this.#parseConfigUsers(
                    Buffer.concat(
                      chunks as unknown as Uint8Array[],
                    ).toString('utf-8'),
                  );

                  resolve(data);
                }
              }
              case 'FTP': {
                const { host, password, username, filePath } = this;
                if (!host && !password && !username && !filePath)
                  return;
                const ftpClient = new FTP.Client(this.timeout);
                const connected = await ftpClient.access({
                  port: this.port ?? 22,
                  host,
                  user: username,
                  password,
                  secure: false,
                });
                if (ftpClient && connected) {
                  // Custom writable stream that accumulates chunks into a string
                  const chunks: Buffer[] = [];
                  const stream = new Writable({
                    write(chunk, encoding, callback) {
                      chunks.push(chunk);
                      callback();
                    },
                  });

                  await ftpClient.downloadTo(
                    stream,
                    this.adminsFilePath,
                  );
                  ftpClient.close();
                  const data = this.#parseConfigUsers(
                    Buffer.concat(
                      chunks as unknown as Uint8Array[],
                    ).toString('utf-8'),
                  );

                  resolve(data);
                }
              }
              case 'FTP-secure': {
                const { host, password, username, filePath } = this;
                if (!host && !password && !username && !filePath)
                  return;
                const ftpClient = new FTP.Client(this.timeout);
                const connected = await ftpClient.access({
                  port: this.port ?? 22,
                  host,
                  user: username,
                  password,
                  secure: true,
                });
                if (ftpClient && connected) {
                  // Custom writable stream that accumulates chunks into a string
                  const chunks: Buffer[] = [];
                  const stream = new Writable({
                    write(chunk, encoding, callback) {
                      chunks.push(chunk);
                      callback();
                    },
                  });

                  await ftpClient.downloadTo(
                    stream,
                    this.adminsFilePath,
                  );
                  ftpClient.close();
                  const data = this.#parseConfigUsers(
                    Buffer.concat(
                      chunks as unknown as Uint8Array[],
                    ).toString('utf-8'),
                  );

                  resolve(data);
                }
              }
            }
          }
        }
        reject('Cannot read admins file');
      } catch (error) {
        reject(error);
      }
    });
  }

  async close() {
    if (this.sftp && this.sftpConnected) {
      await this.sftp.end();
      this.sftp = undefined;
      this.sftpConnected = false;
      this.logger.warn('Close connection');
      this.emit('close');
    }

    if (this.tail) {
      this.tail.unwatch();
      this.tail = undefined;
      this.logger.warn('Close connection');
      this.emit('close');
    }

    if (this.ftp && this.ftpConnected) {
      this.ftp.close();
      this.ftp = undefined;
      this.ftpConnected = false;
      this.logger.warn('Close connection');
      this.emit('close');
    }
  }

  #parseLine(line: string) {
    parseLine(line, this);
  }

  #parseConfigUsers(data: string) {
    const groups: { [key in string]: string[] } = {};
    const admins: { [key in string]: { [key in string]: true } } = {};
    const groupRgx =
      /(?<=^Group=)(?<groupID>.*?):(?<groupPerms>.*?)(?=(?:\r\n|\r|\n|\s+\/\/))/gm;
    const adminRgx = /(?<=^Admin=)(?<steamID>\d+):(?<groupID>\S+)/gm;

    for (const m of data.matchAll(groupRgx)) {
      const groupID = m.groups?.groupID;
      const groupPerms = m.groups?.groupPerms;

      if (groupID && groupPerms) {
        groups[groupID] = groupPerms.split(',');
      }
    }

    for (const m of data.matchAll(adminRgx)) {
      const groupID = m.groups?.groupID;

      if (groupID) {
        const group = groups[groupID];

        const perms: { [key in string]: boolean } = {};
        for (const groupPerm of group)
          perms[groupPerm.toLowerCase()] = true;

        const steamID = m.groups?.steamID;

        if (steamID) {
          if (steamID in admins) {
            admins[steamID] = Object.assign(admins[steamID], perms);
          } else {
            admins[steamID] = Object.assign(perms);
          }
        }
      }
    }

    return admins;
  }

  async #sftpReader() {
    const { host, password, username, filePath } = this;

    if (
      host &&
      password &&
      username &&
      filePath &&
      this.remoteType === 'SFTP' &&
      !this.sftp &&
      !this.sftpConnected
    ) {
      try {
        this.sftp = new SFTPClient();

        const connected = await this.sftp.connect({
          port: this.port ?? 22,
          host,
          username,
          password,
        });

        if (connected) {
          let lastSize = (await this.sftp.stat(filePath)).size;
          let canStart = true;

          this.emit('connected');
          this.logger.log('Connected to SFTP server');
          this.sftpConnected = true;

          for (;;) {
            if (this.sftp) {
              const { size } = await this.sftp.stat(filePath);
              if (canStart && lastSize != size) {
                canStart = false;

                const stream = this.sftp.createReadStream(filePath, {
                  start: lastSize,
                  end: size,
                });

                const rl = readline.createInterface({
                  input: stream,
                  crlfDelay: Infinity,
                });

                rl.on('line', (line: string) => {
                  this.#parseLine(line);
                });

                rl.on('close', () => {
                  lastSize = size;
                  canStart = true;
                });
              }
            }
          }
        }
      } catch (error) {
        this.logger.error('SFTP connection lost');
        this.logger.error(error as string);
        this.emit('close');

        this.sftpConnected = false;
        this.sftp = undefined;

        if (this.autoReconnect) {
          setTimeout(() => {
            this.logger.log('Reconnect to SFTP');

            this.#sftpReader();
          }, 5000);
        }
      }
    }
  }

  async #ftpReader(secure = false) {
    const { host, password, username, port, filePath } = this;

    if (
      host &&
      password &&
      username &&
      filePath &&
      (this.remoteType === 'FTP' ||
        this.remoteType === 'FTP-secure') &&
      !this.ftp &&
      !this.ftpConnected
    ) {
      try {
        this.ftp = new FTP.Client(this.timeout);

        const connected = await this.ftp.access({
          port: port ?? 21,
          host,
          user: username,
          password,
          secure,
        });

        if (connected) {
          let lastSize = await this.ftp.size(filePath);
          let canStart = true;

          this.emit('connected');
          this.logger.log('Connected to FTP server');
          this.ftpConnected = true;

          for (;;) {
            if (this.ftp) {
              const size = await this.ftp.size(filePath);
              if (canStart && lastSize != size) {
                canStart = false;

                let data = '';
                // Custom writable stream that accumulates chunks into a string
                const stream = new Writable({
                  write(chunk, encoding, callback) {
                    data += chunk.toString(); // Convert each chunk to string and append
                    callback();
                  },
                });

                await this.ftp.downloadTo(stream, filePath, lastSize);

                // Split the accumulated data into lines and process each line
                data.split(/\r?\n/).forEach((line) => {
                  if (line.trim() !== '') {
                    this.#parseLine(line);
                  }
                });

                lastSize = size;
                canStart = true;
              }
            }
          }
        }
      } catch (error) {
        this.logger.error('FTP connection lost');
        this.logger.error(error as string);
        this.emit('close');

        this.ftpConnected = false;
        this.ftp = undefined;

        if (this.autoReconnect) {
          setTimeout(() => {
            this.logger.log('Reconnect to FTP');
            this.#ftpReader();
          }, 5000);
        }
      }
    }
  }

  #localReader() {
    try {
      this.tail = new Tail(this.filePath);

      this.logger.log('Connected');
      this.emit('connected');

      this.tail.on('line', (data) => {
        this.#parseLine(data);
      });
    } catch (error) {
      this.logger.error('Connection lost');
      this.logger.error(error as string);
      this.emit('close');

      if (this.autoReconnect) {
        setTimeout(() => {
          this.logger.log('Reconnect');

          this.#localReader();
        }, 5000);
      }
    }
  }
}
