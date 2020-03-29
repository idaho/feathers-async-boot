module.exports = (app) => {
  return new Promise((resolve, reject) => {
    console.log('Module C... i do some async stuff... please wait');

    setTimeout(() => {
      console.log('Module C... i failed');
      reject('u something bad happend')
    }, 1500);
  });
}
