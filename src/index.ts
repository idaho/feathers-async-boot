import { Application } from '@feathersjs/feathers';
import BootErrorHandling from './errorhandling';
import { BootModule } from '../index.d';

enum BootStrapResultTypes {
  SUCCESS = 'success',
  ERR = 'error',
}

interface BootStrapResult {
  type: BootStrapResultTypes,
  msg?: any
}

export = function (app: Application) {
  let modulesToBoot: Array<BootModule> = [];

  app.bootstrap = bootStrap;
  app._bootinfo = {
    modulesrun: 0
  };

  function bootStrap(addModulesToBoot: Array<BootModule> | BootModule): void {
    if (!Array.isArray(addModulesToBoot)) {
      addModulesToBoot = [addModulesToBoot];
    }

    modulesToBoot = [
      ...modulesToBoot,
      ...addModulesToBoot
    ];
  };

  app.start = function (onError?: BootErrorHandling): Promise<boolean | string> {
    if (!onError) {
      onError = BootErrorHandling.ABORT;
    }

    return new Promise<boolean | string>((resolve, reject) => {
      const promises: Array<Promise<BootStrapResult>> = modulesToBoot.map(bootModule);

      Promise.all(promises)
        .then(results => {
          const errors: Array<BootStrapResult> = results.filter(result => result.type === BootStrapResultTypes.ERR);
          const messages: string = errors.length > 0 ? errors.map(e => e.msg).join(', ') : '';

          app._bootinfo.modulesrun = results.length;

          if (onError === BootErrorHandling.ABORT && errors.length > 0) {
            reject(messages);
          }
          else if (onError === BootErrorHandling.WARN && errors.length > 0) {
            resolve(messages);
          }
          else {
            resolve(true);
          }
        })
    });
  }

  function bootModule(moduleToBoot: BootModule): Promise<BootStrapResult> {
    return new Promise<BootStrapResult>(resolve => {
      moduleToBoot(app)
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
