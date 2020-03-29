const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');

const boot = require('../lib/index');

const asyncModuleA = require('./async-module-a');
const asyncModuleB = require('./async-module-b');
const asyncModuleC = require('./async-module-erroring');

const app = express(feathers());

app.configure(boot({
  straps: [
    asyncModuleA,
    asyncModuleB,
    asyncModuleC
  ]
}));

app
  .start()
  .then(res => {
    const server = app.listen(3040);
    server.on('listening', () => console.log(`server started @ port ${server.address().port}`));
  })
  .catch(err => {
    process.stdout.write(`failed starting the application\n`);
    process.exit(1);
  });
