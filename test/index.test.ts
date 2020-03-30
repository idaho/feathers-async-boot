import feathers from '@feathersjs/feathers';
import { Application } from '@feathersjs/feathers';
import express from '@feathersjs/express';

import boot from '../src/index';
import BootErrorHandling from '../src/errorhandling';

describe('adding boot to application', () => {
  it('adds the start and bootstrap method onto the application', async () => {
    const app: Application = express(feathers());

    app.configure(boot);

    expect.assertions(2);
    expect(app.bootstrap).toBeInstanceOf(Function);
    expect(app.start).toBeInstanceOf(Function);
  });

  it('should be solve when strap errors but error handling is IGNORE', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.IGNORE,
      bootstraps: [
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('a') }, 1);
          })
        },
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { resolve('b') }, 1);
          })
        }
      ]
    };

    app.configure(boot);
    app.bootstrap(mock.bootstraps);

    const result = await app.start(mock.onError);
    expect.assertions(1);

    expect(result).toBe(true);
  });

  it('should concat all bootstrap modules given by multiple bootstrap() calls', async () => {
    const app: Application = express(feathers());

    const cb = () => {
      return new Promise(resolve => {
        setTimeout(() => { app.set('runs', (app.get('runs') || 0) + 1); resolve('a') }, 1);
      })
    };

    const mock = {
      bootstraps: {
        first: [cb, cb],
        second: [cb, cb],
      }
    };

    app.configure(boot);
    app.bootstrap(mock.bootstraps.first);
    app.bootstrap(mock.bootstraps.second);

    await app.start();
    expect.assertions(1);

    expect(app.get('runs')).toBe(4);
  });

  it('should be solve when strap errors but error handling is IGNORE, should wait for all results', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.IGNORE,
      bootstraps: [
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('a') }, 1);
          })
        },
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { resolve('b') }, 500);
          })
        }
      ]
    };

    app.configure(boot);
    app.bootstrap(mock.bootstraps);

    const result = await app.start(mock.onError);
    expect.assertions(1);

    expect(result).toBe(true);
  });

  it('should be reject when strap errors', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.ABORT,
      bootstraps: [
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('a') }, 1);
          })
        },
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { resolve('b') }, 1);
          })
        }
      ]
    };

    app.configure(boot);
    app.bootstrap(mock.bootstraps);

    try {
      await app.start(mock.onError);
    } catch (e) {
      expect.assertions(1);
      expect(e).toBe('a');
    }
  });

  it('should be reject, all errors are concated', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.ABORT,
      bootstraps: [
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('a') }, 1);
          })
        },
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('b') }, 1);
          })
        }
      ]
    };

    app.configure(boot);
    app.bootstrap(mock.bootstraps);

    try {
      await app.start(mock.onError);
    } catch (e) {
      expect.assertions(1);
      expect(e).toBe('a, b');
    }
  });

  it('aborts starting the application when no param is given to start ', async () => {
    const app: Application = express(feathers());

    const mock = {
      bootstraps: [
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('a') }, 1);
          })
        },
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('b') }, 1);
          })
        }
      ]
    };

    app.configure(boot);
    app.bootstrap(mock.bootstraps);

    try {
      await app.start();
    } catch (e) {
      expect.assertions(1);
      expect(e).toBe('a, b');
    }
  });

  it('should be resolve when set onError = warn, all rejected messages are concated', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.WARN,
      bootstraps: [
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('a') }, 1);
          })
        },
        () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => { reject('b') }, 1);
          })
        }
      ]
    };

    app.configure(boot);
    app.bootstrap(mock.bootstraps);

    const result = await app.start(mock.onError);

    expect.assertions(1);
    expect(result).toBe('a, b');

  });
});
