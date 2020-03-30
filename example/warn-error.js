const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');

const boot = require('../lib/index');
const ErrorHandling = require('../lib/errorhandling');

const asyncModuleA = require('./modules/async-module-a');
const asyncModuleB = require('./modules/async-module-b');
const asyncModuleC = require('./modules/async-module-erroring');

const app = express(feathers());

app.configure(boot);
app.bootstrap([
  asyncModuleA,
  asyncModuleB,
  asyncModuleC
]);

app
  .start(ErrorHandling.WARN)
  .then(res => {
    const server = app.listen(3040);
    server.on('listening', () => console.log(`server started @ port ${server.address().port}`, `warnings: ${res}`));
  });
