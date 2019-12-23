const { testH1 } = require('./custom-declarations/test-h1')
const { checkInnerText } = require('./custom-declarations/checkInnerText')
const { checkInnerTexts } = require('./custom-declarations/checkInnerTexts')
const { checkValue } = require('./custom-declarations/checkValue')

module.exports = {
  checkInnerText,
  checkInnerTexts,
  checkValue,
  testH1,
}
