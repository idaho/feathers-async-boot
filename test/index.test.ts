import feathers from '@feathersjs/feathers';
import { Application } from '@feathersjs/feathers';
import express from '@feathersjs/express';

import boot from '../src/index';
import BootErrorHandling from '../src/errorhandling';

describe('adding boot to application', () => {
  it('adds the start method onto the application', async () => {
    const app: Application = express(feathers());

    app.configure(boot());

    expect.assertions(1);
    expect(app.start).toBeInstanceOf(Function);
  });


  it('should be solve when strap errors but error handling is IGNORE', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.IGNORE,
      straps: [
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

    app.configure(boot(mock));

    const result = await app.start();
    expect.assertions(1);

    expect(result).toBe(true);
  });

  it('should be solve when strap errors but error handling is IGNORE, should wait for all results', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.IGNORE,
      straps: [
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

    app.configure(boot(mock));

    const result = await app.start();
    expect.assertions(1);

    expect(result).toBe(true);
  });

  it('should be reject when strap errors', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.ABORT,
      straps: [
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

    app.configure(boot(mock));

    try {
      await app.start();
    } catch (e) {
      expect.assertions(1);
      expect(e).toBe('a');
    }
  });

  it('should be reject, all errors are concated', async () => {
    const app: Application = express(feathers());

    const mock = {
      onError: BootErrorHandling.ABORT,
      straps: [
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

    app.configure(boot(mock));

    try {
      await app.start();
    } catch (e) {
      expect.assertions(1);
      expect(e).toBe('a, b');
    }
  });
});
