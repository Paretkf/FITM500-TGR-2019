var read = require('./read.js');
let Tensorflow = require('./tensorflow_provider')

async function main () {
  let data = await read()
  console.log('max --->', data.max)
  const tensorFlow = new Tensorflow(data, 12)
  await tensorFlow.trainDataScaling()
  await tensorFlow.predictDataScaling([[0,0,0,45,0,0.0416435314,65/1801,59/data.max, 77/data.max, 84/data.max, 229/data.max, 155/data.max]])
}

main();