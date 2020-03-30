module.exports = (app) => {
  return new Promise((resolve, reject) => {

    console.log('Module A... i do some async stuff... please wait');

    setTimeout(() => {
      console.log('Module A... i am ready');
      resolve(true)
    }, 2000);
  });
}
