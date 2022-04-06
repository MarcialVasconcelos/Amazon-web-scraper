const RequestService = require("../services/requestService")
const ResponsesMsg = require("../utils/messages.json")
const validateMessage = require("../validations/validation")
const saveToMongoDb = require("../services/saveToMongoDb")

class ResultsController {
  static async onGet(req, res) {
    try {
      const incomingMessage = req.body
      validateMessage(incomingMessage)

      const data = await RequestService.start(req.body)

      console.log(`${data.length} results found for "${req.body.product}"`)
      // console.log(data)

      data.forEach(async (product) => {
        // console.log(product)
        await saveToMongoDb(product)
      })

      let responseData

      if (data.status) responseData = {
        status: data.status,
        message: data.message
      }
      else responseData = { ...ResponsesMsg.success, data }

      res.send(responseData)
    } catch (error) {
      res.send({ status: error.status || 500, message: error.message })
    }
  }
}

module.exports = ResultsController;