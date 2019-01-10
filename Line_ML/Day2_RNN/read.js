var csv = require('fast-csv')

module.exports = function readCSV () {
  let data = []
  return new Promise(function(resolve, reject) {
      csv.fromPath('THB.csv').on("data",(str) => {
        data.push(str)
      })
      .on("end",() => {
        console.log('number of data: ', data.length)
        let yData = []
        let xData = []
        // กลับค่าของ Array ให้ข้อมูลใหม่อยู่ด้านบน
        data.reverse()
        for (let i = 0; i < (data.length - 8); i++) {
          yData.push(parseFloat(data[i+7][1]))
          xData.push([
            parseFloat(data[i][1]),
            parseFloat(data[i+1][1]),
            parseFloat(data[i+2][1]),
            parseFloat(data[i+3][1]),
            parseFloat(data[i+4][1]),
            parseFloat(data[i+5][1]),
            parseFloat(data[i+6][1])
          ])
        }
        resolve({
          x: xData,
          y: yData
        })
      })
  })
}