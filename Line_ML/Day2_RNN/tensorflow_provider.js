const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')


module.exports = class LstmModel {
  constructor () {
    console.log('\x1b[36m%s\x1b[0m', 'Initail LstmModel...');
  }
  // csvData = {
  //   x: [[1, 2, 3], [2, 3, 4]],
  //   y: [4, 5]
  // }
  // scaling data 0 - 1 use MAX for assign value
  async trainDataScaling (csvData) {
    let xs = [];
    let ys = [];
    let trainXS;
    let trainYS;
    let MAX = -999;
    // นั่นคือขนาดของก้าวที่เราจะทำการปรับในแต่ละครั้งก็สำคัญมีหลายวิธีที่ถูกเสนอมาสำหรับปรับแบบอัตโนมัติ
    const LEARNING_RATE = 0.0001;
    const model = tf.sequential();

    // เพิ่ม layer lstm
    model.add(tf.layers.lstm({
      // จำนวน node ของการ train
      units: 100,
      // มิติของข้อมูลวันรอบตัวเองกี่ครั้ง วน 3 [10,20,30] = [3,1] ; [[10,20,30], [10,20,30]] = [3,2]
      inputShape: [3, 1],
      returnSequences: false
    }));

    // เพิ่ม layer dropout
    model.add(tf.layers.dropout ({
      rate: 0.2
    }));

    // เพิ่ม layer dense
    model.add(tf.layers.dense({
      // จำนวนผลลัพธ์
      units: 1,
      kernelInitializer: 'VarianceScaling',
      // Function กรองข้อมูล
      activation: 'relu'
    }));

    // diff เพื่อหาความชัน
    const optimizer = tf.train.sgd(LEARNING_RATE)

    model.compile({
      optimizer: optimizer,
      // หาค่า mean ที่ใส่เข้าไป ปรับ weigth
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    //  ข้อมูลที่ใช้ในการ train
    xs = await csvData.x;

    MAX = this.getMax(csvData.y)
    csvData.y = csvData.y.map((number) => {
      return number/MAX;
    })

    // ข้อมูลที่ควรจะเป็น 
    ys = await csvData.y;

    trainXS = await tf.tensor2d(xs);
    trainXS = await tf.reshape(trainXS, [-1, 3, 1])

    trainYS = await tf.tensor(ys)
    trainYS = await tf.reshape(trainYS, [-1, 1])

    const history = await model.fit( trainXS, trainYS, {
      // จำนวนก้าว 100
      batchSize: 10,
      // จำนวนรอบที่ train 1000
      epochs: 30,
      // ดึงมา train แบบสลับ = true
      shuffle: true,
      // spite 20 ดึงมา train 80 (0.2)
      validationSplit: 0.2
    })
    await model.save('file://model')
  }
  // data = [1, 2, 3, 4]
  getMax (data) {
    let max = -999
    for (let i = 0; i < data.length; i++) {
      if (max <= data[i]) {
        max = data[i];
      }
    }
    return max
  }
// csvData = {
//   x: [[1, 2, 3], [2, 3, 4]],
//   y: [4, 5]
// }
  async trainData (csvData) {
    let xs = [];
    let ys = [];
    let trainXS;
    let trainYS;
    // นั่นคือขนาดของก้าวที่เราจะทำการปรับในแต่ละครั้งก็สำคัญมีหลายวิธีที่ถูกเสนอมาสำหรับปรับแบบอัตโนมัติ
    const LEARNING_RATE = 0.0001;
    const model = tf.sequential();

    // เพิ่ม layer lstm
    model.add(tf.layers.lstm({
      // จำนวน node ของการ train
      units: 100,
      // มิติของข้อมูลวันรอบตัวเองกี่ครั้ง วน 3 [10,20,30] = [3,1] ; [[10,20,30], [10,20,30]] = [3,2]
      inputShape: [3, 1],
      returnSequences: false
    }));

    // เพิ่ม layer dropout
    model.add(tf.layers.dropout ({
      rate: 0.2
    }));

    // เพิ่ม layer dense
    model.add(tf.layers.dense({
      // จำนวนผลลัพธ์
      units: 1,
      kernelInitializer: 'VarianceScaling',
      // Function กรองข้อมูล
      activation: 'relu'
    }));

    // diff เพื่อหาความชัน
    const optimizer = tf.train.sgd(LEARNING_RATE)

    model.compile({
      optimizer: optimizer,
      // หาค่า mean ที่ใส่เข้าไป ปรับ weigth
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    //  ข้อมูลที่ใช้ในการ train
    xs = await csvData.x;

    // ข้อมูลที่ควรจะเป็น 
    ys = await csvData.y;

    trainXS = await tf.tensor2d(xs);
    trainXS = await tf.reshape(trainXS, [-1, 3, 1])

    trainYS = await tf.tensor(ys)
    trainYS = await tf.reshape(trainYS, [-1, 1])

    const history = await model.fit( trainXS, trainYS, {
      // จำนวนก้าว 100
      batchSize: 10,
      // จำนวนรอบที่ train 1000
      epochs: 30,
      // ดึงมา train แบบสลับ = true
      shuffle: true,
      // spite 20 ดึงมา train 80 (0.2)
      validationSplit: 0.2
    })
    await model.save('file://model')
  }
  // data = [[1, 2, 3], [2, 3, 4]]
  async predictData (data) {
    const load = () => {
      return new Promise((resolve, reject) => {
        resolve(tf.loadModel('file://model/model.json'))
      })
    }
    let model = await load()
    let testDataTS = tf.tensor2d(data)
    testDataTS = tf.reshape(testDataTS, [-1, 3, 1])
    const r = model.predict(testDataTS)
    let result = r.dataSync()[0]
    console.log(`Result is : ${result}`)
    return result
  }

   // data = [[1, 2, 3], [2, 3, 4]]
   async predictDataScaling (data, max) {
    const load = () => {
      return new Promise((resolve, reject) => {
        resolve(tf.loadModel('file://model/model.json'))
      })
    }
    let model = await load()
    let testDataTS = tf.tensor2d(data)
    testDataTS = tf.reshape(testDataTS, [-1, 3, 1])
    const r = model.predict(testDataTS)
    let result = r.dataSync()[0]
    console.log(`Scale Down result is : ${result}`);
    console.log('result is : ', result * max);
    return {
      scalingResult: result,
      result: result * max
    }
  }
}
