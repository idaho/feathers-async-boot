# feathers-async-boot

[![Build Status](https://travis-ci.org/idaho/feathers-async-boot.png)](https://travis-ci.org/idaho/feathers-async-boot)
[![Node.js CI](https://github.com/idaho/feathers-async-boot/workflows/Node.js%20CI/badge.svg)](https://github.com/idaho/feathers-async-boot/actions?query=workflow:%22Node.js+CI%22)

Booting FeathersJS asynchron.

* [About](#about)
* [Installation](#installation)
* [Configuration](#configuration)
* [Example](#example)

# About

Starting the application after all required tasks are done. For example you have 
to fill your memory storage with content before the application should start 
the http server.


# Installation

```bash
npm install --save feathers-async-boot
```
# Usage
* create a module which should do you asynchron task. This module __must__ return a Promise 
* register the async bootstrap module
* configure the async bootstrap
* Call `app.start()`. This will return a Promise.

  Example:
  ```js
  const app = feathers();

  ...

  app.configure(boot);
  app.bootstrap([...modules]);

  app.start()
    .then(() => {
      app.listen(3040);
    })
    .catch(err => {
      logger.error(`error during boostrap the application. ${err}`);
    });
  ```

# Configuration

## Error handling

There are different posibilities to start your application, even on when your bootstrap
modules are rejected.

### ABORT

* with finally (using finally Node.js >= 10 is required)

```js
  const app = feathers();

  app
    .start()
    .finally(() => {
       app.listen(3040);
    });
  ```

  * or on rejection (using Node.js < 10)

```js
  const app = feathers();

  app
    .start()
    .then(res => {

    })
    .catch(err => {
       app.listen(3040);
    });
  ```
### WARN

The start will always resolve, as a result you get all possible errors

```js
  const app = feathers();
  const ErrorHandling = requier('feathers-async-boot/lib/errorhandling');

  app
    .start(ErrorHandling.WARN)
    .then(res => {
       app.listen(3040);
    });
  ```

### IGNORE

The start will always resolve, result will be always true

```js
  const app = feathers();
  const ErrorHandling = requier('feathers-async-boot/lib/errorhandling');

  app
    .start(ErrorHandling.WARN)
    .then(res => {
       app.listen(3040);
    });
  ```

# Example

  ```js
  const feathers = require('@feathersjs/feathers');
  const express = require('@feathersjs/express');
  const boot = require('feathers-async-boot');

  const asyncModuleToBoot = require('./async-module-to-boot');

  const app = express(feathers());

  app.configure(boot);

  app.bootstrap([asyncModuleToBoot]);
  app.bootstrap([asyncModuleToBoot]);
  app.bootstrap([asyncModuleToBoot]);


  app
    .start()
    .then(res => {
        const server = app.listen(3040);
        server.on('listening', () => {
          console.log(`server started @ port ${server.address().port}`);
        });
    });
  ```

for more examples see the example directory.