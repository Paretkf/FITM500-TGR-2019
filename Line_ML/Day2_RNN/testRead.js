var read = require('./read.js');

async function main () {
  let data = await read();
  console.log(data);
}

main();