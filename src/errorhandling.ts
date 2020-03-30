enum BootErrorHandling {
  ABORT = 'abort',    // rejects the promise - start process
  WARN = 'warn',      // resolves start process but will return the error messages if there was a rejection
  IGNORE = 'ingore'   // will always resolves the start process and will return only true
}

export = BootErrorHandling;
