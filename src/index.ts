import { Application } from '@feathersjs/feathers';
import BootErrorHandling from './errorhandling';

interface Boot {
  errorHandling: () => String
}

interface BootOptions {
  onError?: BootErrorHandling,
  straps?: Array<BootStrap>
};

enum BootStrapResultTypes {
  SUCCESS = 'success',
  ERR = 'error',
}

interface BootStrapResult {
  type: BootStrapResultTypes,
  msg?: any
}

declare module '@feathersjs/feathers' {
  interface Application<ServiceTypes = {}> {
    boot(options?: BootOptions): Boot;
    start(): Promise<boolean>;
  }
}

interface BootStrap {
  (app?: Application): Promise<any>
}

export = function (options?: BootOptions) {
  let straps: Array<any> = [];
  let onError: BootErrorHandling = BootErrorHandling.ABORT;

  if (options && options.straps) {
    straps = options.straps;
  }

  if (options && options.onError) {
    onError = options.onError;
  }

  return function (app: Application) {
    app.start = function (): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        const promises: Array<Promise<BootStrapResult>> = straps.map(runStrap);

        Promise.all(promises)
          .then(results => {
            const errors = results.filter(result => result.type === BootStrapResultTypes.ERR);
            if (onError === BootErrorHandling.ABORT && errors.length > 0) {
              reject(errors.map(e => e.msg).join(', '));
            } else {
              resolve(true);
            }
          })
      });
    }

    function runStrap(strap: BootStrap): Promise<BootStrapResult> {
      return new Promise<BootStrapResult>(resolve => {
        strap(app)
          .then(res => {
            resolve({
              type: BootStrapResultTypes.SUCCESS
            });
          })
          .catch(err => {
            resolve({
              type: BootStrapResultTypes.ERR,
              msg: err
            });
          })
      });
    }
  }
}
