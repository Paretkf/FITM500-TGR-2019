const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')


module.exports = class LstmModel {
  constructor (csvData, amountX = 3) {
    this.trainData = csvData
    // นั่นคือขนาดของก้าวที่เราจะทำการปรับในแต่ละครั้งก็สำคัญมีหลายวิธีที่ถูกเสนอมาสำหรับปรับแบบอัตโนมัติ
    this.LEARNING_RATE = 0.001
    // จำนวนของ x ที่ส่งมา
    this.amountX = amountX
    // จำนวน node ของการ train 10
    this.lstmUnits = 16
    // ค่า dropout 0.2
    this.dropoutRate = 0.022
    // จำนวนก้าว 100
    this.batchSize = 80,
    // จำนวนรอบที่ train 1000
    this.epochs = 50,
    // ดึงมา train แบบสลับ = true
    this.shuffle = true,
    // spite 20 ดึงมา train 80 (0.2)
    this.validationSplit = 0.2
    // หา Max ของ Data 
    this.MAX = csvData.max
    console.log('\x1b[36m%s\x1b[0m', 'Initail LstmModel...')
  }

  async trainDataScaling () {
    let xs = []
    let ys = []
    let trainXS
    let trainYS
    // นั่นคือขนาดของก้าวที่เราจะทำการปรับในแต่ละครั้งก็สำคัญมีหลายวิธีที่ถูกเสนอมาสำหรับปรับแบบอัตโนมัติ
    const LEARNING_RATE = this.LEARNING_RATE
    const model = tf.sequential()

    // เพิ่ม layer lstm
    model.add(tf.layers.lstm({
      // จำนวน node ของการ train
      units: this.lstmUnits,
      // มิติของข้อมูลวันรอบตัวเองกี่ครั้ง วน 3 [10,20,30] = [3,1] ; [[10,20,30], [10,20,30]] = [3,2]
      inputShape: [this.amountX, 1],
      returnSequences: false
    }));

    // เพิ่ม layer dropout
    model.add(tf.layers.dropout ({
      rate: this.dropoutRate
    }));

    // เพิ่ม layer dense
    model.add(tf.layers.dense({
      // จำนวนผลลัพธ์
      units: 3,
      kernelInitializer: 'VarianceScaling',
      // Function กรองข้อมูล
      activation: 'relu'
    }));

    // diff เพื่อหาความชัน
    const optimizer = tf.train.adam(LEARNING_RATE)

    model.compile({
      optimizer: optimizer,
      // หาค่า mean ที่ใส่เข้าไป ปรับ weigth
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    //  ข้อมูลที่ใช้ในการ train
    xs = await this.trainData.x;

    this.trainData.y = this.trainData.y.map((number) => {
      return [number[0]/this.MAX, number[1]/this.MAX, number[2]/this.MAX]
    })

    // ข้อมูลที่ควรจะเป็น 
    ys = await this.trainData.y;

    trainXS = await tf.tensor2d(xs);
    trainXS = await tf.reshape(trainXS, [-1, this.amountX, 1])

    trainYS = await tf.tensor2d(ys)
    trainYS = await tf.reshape(trainYS, [-1, 3])

    const history = await model.fit( trainXS, trainYS, {
      // จำนวนก้าว 100
      batchSize: this.batchSize,
      // จำนวนรอบที่ train 1000
      epochs: this.epochs,
      // ดึงมา train แบบสลับ = true
      shuffle: this.shuffle,
      // spite 20 ดึงมา train 80 (0.2)
      validationSplit: this.validationSplit
    })
    await model.save('file://model')
  }
  // data = [1, 2, 3, 4]
  getMax () {
    let max = -999
    for (let i = 0; i < this.trainData.y.length; i++) {
      if (max <= this.trainData.y[i]) {
        max = this.trainData.y[i];
      }
    }
    return max
  }

  async trainData () {
    let xs = [];
    let ys = [];
    let trainXS;
    let trainYS;
    // นั่นคือขนาดของก้าวที่เราจะทำการปรับในแต่ละครั้งก็สำคัญมีหลายวิธีที่ถูกเสนอมาสำหรับปรับแบบอัตโนมัติ
    const LEARNING_RATE = this.LEARNING_RATE;
    const model = tf.sequential();

    // เพิ่ม layer lstm
    model.add(tf.layers.lstm({
      // จำนวน node ของการ train
      units: this.lstmUnits,
      // มิติของข้อมูลวันรอบตัวเองกี่ครั้ง วน 3 [10,20,30] = [3,1] ; [[10,20,30], [10,20,30]] = [3,2]
      inputShape: [this.amountX, 1],
      returnSequences: false
    }));

    // เพิ่ม layer dropout
    model.add(tf.layers.dropout ({
      rate: this.dropoutRate
    }));

    // เพิ่ม layer dense
    model.add(tf.layers.dense({
      // จำนวนผลลัพธ์
      units: 3,
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
    xs = await this.trainData.x;

    // ข้อมูลที่ควรจะเป็น 
    ys = await this.trainData.y;

    trainXS = await tf.tensor2d(xs);
    trainXS = await tf.reshape(trainXS, [-1, this.amountX, 1])

    trainYS = await tf.tensor(ys)
    trainYS = await tf.reshape(trainYS, [-1, 1])

    const history = await model.fit( trainXS, trainYS, {
      // จำนวนก้าว 100
      batchSize: this.batchSize,
      // จำนวนรอบที่ train 1000
      epochs: this.epochs,
      // ดึงมา train แบบสลับ = true
      shuffle: this.shuffle,
      // spite 20 ดึงมา train 80 (0.2)
      validationSplit: this.validationSplit
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
    testDataTS = tf.reshape(testDataTS, [-1, this.amountX, 1])
    const r = model.predict(testDataTS)
    let result = r.dataSync()[0]
    console.log(`Result is : ${result}`)
    return result
  }

   // data = [[1, 2, 3], [2, 3, 4]]
   async predictDataScaling (data) {
    const load = () => {
      return new Promise((resolve, reject) => {
        resolve(tf.loadModel('file://model/model.json'))
      })
    }
    let model = await load()
    let testDataTS = tf.tensor2d(data)
    testDataTS = tf.reshape(testDataTS, [-1, this.amountX, 1])
    const r = model.predict(testDataTS)
    let result = r.dataSync()
    console.log(`Scale Down result is : ${result}`);
    console.log(`result is : [${result[0] * this.MAX}, ${result[1] * this.MAX}, ${result[2] * this.MAX}]`);
    return {
      scalingResult: result,
      result: [result[0] * this.MAX, result[1] * this.MAX, result[2] * this.MAX]
    }
  }
}
