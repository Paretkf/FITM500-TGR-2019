
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const read = require('./read.js');
var xs = [];
var ys = [];
var trainXS;
var trainYS;

function range(start, end) {
    var ans = [];
    for (let i = start; i < end; i++) {
        ans.push(i);
    }
    return ans;
}
let MAX = -999;
async function prepareData() {
    let csvData = await read();
    MAX = -999;
    const len = csvData.y.length
    for (i=0; i < len; i++) {
        if (MAX <= csvData.y[i]) {
            MAX = csvData.y[i];
        }
    }
    
    csvData.y = csvData.y.map((number) => {
        return number/MAX;
    })

    // let arr = range(TIME_STEP, dataset.length - NUM_OUT + 1);

    // arr.forEach(function(i) {
        
    // });
  //  ข้อมูลที่ใช้ในการ train
   xs = await csvData.x;
  // ข้อมูลที่ควรจะเป็น 
   ys = await csvData.y;
   trainXS = await tf.tensor2d(xs);
   trainXS = await tf.reshape(trainXS, [-1, 3, 1]);

   trainYS = await tf.tensor(ys)
   trainYS = await tf.reshape(trainYS, [-1, 1]);
    
}

const model = tf.sequential();

model.add(tf.layers.lstm({
    // จำนวน node ของการ train
    units: 500,
    // มิติของข้อมูลวันรอบตัวเองกี่ครั้ง วน 3 [10,20,30] = [3,1] ; [[10,20,30], [10,20,30]] = [3,2]
    inputShape: [3, 1],
    returnSequences: false
}));

model.add(tf.layers.dropout ({
  rate: 0.2
}));
model.add(tf.layers.dense({
  // จำนวนผลลัพธ์
   units: 1,
   kernelInitializer: 'VarianceScaling',
   // Function กรองข้อมูล
   activation: 'relu'
}));
// นั่นคือขนาดของก้าวที่เราจะทำการปรับในแต่ละครั้งก็สำคัญมีหลายวิธีที่ถูกเสนอมาสำหรับปรับแบบอัตโนมัติ
const LEARNING_RATE = 0.0001;
// diff เพื่อหาความชัน
const optimizer = tf.train.sgd(LEARNING_RATE);

model.compile({
    optimizer: optimizer,
    // หาค่า mean ที่ใส่เข้าไป ปรับ weigth
    loss: 'meanSquaredError',
    metrics: ['accuracy']
});

async function main(){
	async function trainModel(){
    const history = await model.fit(
      trainXS,
      trainYS,
      {
        // จำนวนก้าว
        batchSize: 50,
        // จำนวนรอบที่ train
        epochs: 100,
        // ดึงมา train แบบสลับ = true
        shuffle: true,
        // spite 20 ดึงมา train 80 (0.2)
        validationSplit: 0.2
      });
  }
    await prepareData();

	await trainModel();
    const saveResult = await model.save('file://model');
    console.error(saveResult);
    const load = async () => {
      const model = await tf.loadModel('file://model/model.json');
    };
      
    load();
    let data = [[11, 23, 2018]];
    let dataResult = 33.08;
    let testDataTS = tf.tensor2d(data);
    testDataTS = tf.reshape(testDataTS, [-1, 3, 1]);
    const r = model.predict(testDataTS);
    let result = r.dataSync()[0];
    console.log(`Scale Down result is : ${result}`);
    console.log('result is : ', result * MAX);
    console.log('Data Result is : ', dataResult);
    console.log('Value_loss : ', dataResult - (result * MAX));
    
}

main();
