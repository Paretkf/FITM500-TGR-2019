const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

//var csv = require("fast-csv");
var xs = [];
var ys = [];
/*
function range(start, end) {
    var ans = [];
    for (let i = start; i < end; i++) {
        ans.push(i);
    }
    return ans;
}

function readCSV() {
    return new Promise(function(resolve, reject) {
        csv
        .fromPath(file_name) 
        .on("data", function(str){    
        })
        .on("end", function(){
        
        console.log(data.length);
        resolve(data);
        });
    });
}
*/

async function prepareData() {
    /*
    MAX = -999;
    const len = data.length
    for (i=0; i<len; i++) {
        if (MAX <= data[i]) {
            MAX = data[i];
        }
    }
    
    let dataset = data.map((number) => {
        return number/MAX;
    })

    let arr = range(TIME_STEP, dataset.length - NUM_OUT + 1);

    arr.forEach(function(i) {
        
    });
    */
   xs = [[10,20,30],[20,30,40], ,[30,40,50]];
   ys = [40,50,60];
    
}

const model = tf.sequential();

model.add(tf.layers.xxx({
    units: xxx,
    inputShape: [xxx],
    returnSequences: xxx
}));

model.add(tf.layers.xxx({
    units: xxx,
    kernelInitializer: 'VarianceScaling',
    activation: 'xxx'
}));

const LEARNING_RATE = xxx;
const optimizer = tf.train.xxx(LEARNING_RATE);

model.compile({
    optimizer: optimizer,
    loss: 'meanSquaredError',
    metrics: ['accuracy'],
});

async function main(){
	async function trainModel(){
        const history = await model.fit(
            trainXS,
            trainYS,
            {
                batchSize: xxx,
                epochs: xxx,
                shuffle:xxx,
                validationSplit: xxx
            });
    }
    await prepareData();
    
    
	await trainModel();
    const saveResult = await model.save('file://xxx');
    
    const load = async () => {
        const model = await tf.loadModel('file://xxx');
      };
      
    load();

    const r = model.predict(xxx);
    let result = r.dataSync()[0];
    console.log(result);
}

main();
