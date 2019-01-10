var read = require('./read.js');
let Tensorflow = require('./tensorflow_provider')

async function main () {
  let data = await read()
  const tensorFlow = new Tensorflow(data, 7)
  await tensorFlow.trainDataScaling()
  await tensorFlow.predictDataScaling([[32.95, 32.845, 32.861, 32.94, 32.99, 32.89, 32.98]], 35)
}

main();