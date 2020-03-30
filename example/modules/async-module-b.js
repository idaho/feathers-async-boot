module.exports = (app) => {
  return new Promise((resolve, reject) => {

    console.log('Module B... i do some async stuff... please wait');

    setTimeout(() => {
      console.log('Module B... i am ready');
      resolve(true)
    }, 1000);
  });
}
