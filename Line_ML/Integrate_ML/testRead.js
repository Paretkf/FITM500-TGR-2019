var read = require('./read.js');
let Tensorflow = require('./tensorflow_provider')

async function main () {
  let data = await read()
  console.log('max --->', data.max)
  console.log(data)
  const tensorFlow = new Tensorflow(data, 12)
  await tensorFlow.trainDataScaling()
  await tensorFlow.predictDataScaling([[0,0,0,0,0,0.0416435314,65/1801,59/1801]])
}

main();