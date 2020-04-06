import feathers from '@feathersjs/feathers';
import { Application } from '@feathersjs/feathers';
import express from '@feathersjs/express';

import boot from '../src/index';
import BootErrorHandling from '../src/errorhandling';

const cb = {
  resolve: function () {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => { resolve('a') }, 1);
    });
  },
  reject: function () {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => { reject('b') }, 1);
    });
  },
}
let app: Application;

beforeEach(() => {
  app = express(feathers());
  app.configure(boot);
});

describe('booting', () => {
  it('adds start() method to application', () => {
    expect.assertions(2);
    expect(app).toHaveProperty('start');
    expect(app.start).toBeInstanceOf(Function);
  });

  it('adds bootstrap() method to application', () => {
    expect.assertions(2);
    expect(app).toHaveProperty('bootstrap');
    expect(app.bootstrap).toBeInstanceOf(Function);
  });

  it('will have _bootinfo object on application', () => {
    expect.assertions(1);
    expect(app).toHaveProperty('_bootinfo');
  });

  it('start without params should be ABORT', () => {
    app.bootstrap([cb.reject, cb.reject]);

    expect.assertions(1);
    return expect(app.start()).rejects.toBe('b, b');
  });

  it('should be allowed to add a single module and an array', () => {
    app.bootstrap(cb.resolve);
    app.bootstrap([cb.resolve, cb.resolve]);

    expect.assertions(1);
    return expect(app.start()).resolves.toBe(true);
  });
});

describe('when error handling is ABORT', () => {
  it('should concat all messages', () => {
    app.bootstrap([cb.resolve, cb.resolve]);
    app.bootstrap([cb.resolve, cb.resolve]);

    expect.assertions(1);
    return app
      .start()
      .then(result => {
        expect(app._bootinfo.modulesrun).toBe(4);
      });
  });

  it('should be reject when a module failed', () => {
    app.bootstrap([cb.resolve, cb.reject]);

    expect.assertions(1);
    return expect(app.start()).rejects.toBe('b');
  });

  it('should contains all errors', () => {
    app.bootstrap([cb.reject, cb.reject]);

    expect.assertions(1);
    return expect(app.start()).rejects.toBe('b, b');
  });
});

describe('when error handling is IGNORE', () => {
  it('should be solve', () => {
    app.bootstrap([cb.reject, cb.resolve]);

    expect.assertions(1);
    return expect(app.start(BootErrorHandling.IGNORE)).resolves.toBe(true);
  });

  it('waits for all executions', () => {
    app.bootstrap([
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
    ]);

    expect.assertions(1);
    return app
      .start(BootErrorHandling.IGNORE)
      .then(result => {
        expect(app._bootinfo.modulesrun).toBe(2);
      });
  });
});

describe('when error handling is WARN', () => {
  it('should be resolve and recive all rejected messages', () => {
    app.bootstrap([cb.reject, cb.reject]);

    expect.assertions(1);
    return expect(app.start(BootErrorHandling.WARN)).resolves.toBe('b, b');
  });
});
