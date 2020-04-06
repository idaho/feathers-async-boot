import { Application } from '@feathersjs/feathers';
import BootErrorHandling from './src/errorhandling';

interface BootInfo {
  modulesrun: number
}

interface BootModule {
  (app?: Application): Promise<any>
}

declare module '@feathersjs/feathers' {
  interface Application<ServiceTypes = {}> {
    bootstrap(addModulesToBoot: Array<BootModule>): void;
    bootstrap(addModuleToBoot: BootModule): void;
    _bootinfo: BootInfo;
    start(onError?: BootErrorHandling): Promise<boolean | string>;
  }
}
