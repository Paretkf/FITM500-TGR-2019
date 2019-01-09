var csv = require("fast-csv")
// let monthNumber = {
//   Jan: 1,
//   Feb: 2,
//   Mar: 3,
//   Apr: 4,
//   May: 5,
//   Jun: 6,
//   Jul: 7,
//   Aug: 8,
//   Sep: 9,
//   Oct: 10,
//   Nov: 11,
//   Dec: 12
// }
// module.exports = function readCSV () {
//   let data = []
//   return new Promise(function(resolve, reject) {
//       csv.fromPath('THB.csv').on("data",(str) => {
//         data.push(str)
//       })
//       .on("end",() => {
//         console.log('number of data: ', data.length)
//         let yData = []
//         let xData = []
//         for (let i = 0; i < data.length; i++){
//           let xString = data[i][0].replace(/,/g, '')
//           yData.push(parseFloat(data[i][1]))
//           let xArray = xString.split(' ')
//           xData.push([
//             monthNumber[xArray[0]],
//             parseInt(xArray[1]),
//             parseInt(xArray[2])
//           ])
//         }
//         resolve({
//           x: xData,
//           y: yData
//         })
//       })
//   })
// }

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
        for (let i = 0; i < (data.length - 4); i++) {
          yData.push(parseFloat(data[i+3][1]))
          xData.push([
            parseFloat(data[i][1]),
            parseFloat(data[i+1][1]),
            parseFloat(data[i+2][1])
          ])
        }
        console.log('number of yData: ', data.length)
        resolve({
          x: xData,
          y: yData
        })
      })
  })
}