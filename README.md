# SquadLogs

This library is designed for the game Squad, it will give you the ability to easily parse game logs. It is possible to read the file locally or protocol SFTP. I hope this will be useful to you!

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the

```console
$ npm install squad-logs
```

or

```console
$ yarn add squad-logs
```

## Quick Start

### SFTP

```typescript
import { LogsReader } from 'squad-logs';

const logsEmitter = LogsReader({
  remoteFilePath: '/SquadGame/Saved/Logs/SquadGame.log',
  host: '127.0.0.1',
  username: 'root',
  password: 'password',
});

logsEmitter.on('PLAYER_CONNECTED', (data) => {
  console.log(data);
});
```

### LOCAL

```typescript
import { LogsReader } from 'squad-logs';

const logsEmitter = LogsReader({
  localFilePath: '/SquadGame/Saved/Logs/SquadGame.log',
});

logsEmitter.on('PLAYER_CONNECTED', (data) => {
  console.log(data);
});
```
