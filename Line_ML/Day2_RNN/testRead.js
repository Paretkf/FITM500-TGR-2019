var read = require('./read.js');
let Tensorflow = require('./tensorflow_provider')
const tensorFlow = new Tensorflow()

async function main () {
  let data = await read();
  await tensorFlow.trainDataScaling(data)
  await tensorFlow.predictDataScaling([[32.99, 32.89, 32.98]], 35)
}

main();