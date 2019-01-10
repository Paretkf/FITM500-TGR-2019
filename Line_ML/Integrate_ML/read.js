var csv = require('fast-csv')

module.exports = function readCSV () {
  let data = []
  return new Promise(function(resolve, reject) {
      csv.fromPath('sanam.csv').on("data",(str) => {
        let arrayData = str[0].split(';')
        for (let index = 1; index < arrayData.length; index++) {
          // ตัด 0
          // if (parseInt(arrayData[index]) > 0) {
          //   data.push(parseInt(arrayData[index]))
          // }
          // ไม่ตัด 0
          if (parseInt(arrayData[index]) >= 0) {
            data.push(parseInt(arrayData[index]))
          }
        }
        // console.log(data)
      })
      .on("end",() => {
        // data.splice(0, 1)
        // console.log('number of data: ', data)
        console.log('number of data: ',data.length)
        let xData = []
        let yData = []
        let maxData = -9999
        for (let i = 0; i < (data.length - 15); i++) {
          if (maxData <= data[i]) {
            maxData = data[i]
          }
          yData.push([
            data[i+12],
            data[i+13],
            data[i+14]
          ])
          xData.push([
            data[i],
            data[i+1],
            data[i+2],
            data[i+3],
            data[i+4],
            data[i+5],
            data[i+6],
            data[i+7],
            data[i+8],
            data[i+9],
            data[i+10],
            data[i+11],
          ])
        }
        resolve({
          x: xData,
          y: yData,
          max: maxData
        })
      })
  })
}