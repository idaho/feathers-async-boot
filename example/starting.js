const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');

const boot = require('../lib/index');

const asyncModuleA = require('./async-module-a');
const asyncModuleB = require('./async-module-b');

const app = express(feathers());

app.configure(boot({
  straps: [
    asyncModuleA,
    asyncModuleB
  ]
}));

app
  .start()
  .then(res => {
    const server = app.listen(3040);
    server.on('listening', () => console.log(`server started @ port ${server.address().port}`));
  });
