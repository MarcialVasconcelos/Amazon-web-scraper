const Request = require("./request")
const resp = require("./messages.json")
const validateMessage = require("./validation")

class Controller {
  static async onGet(req, res) {
    try {
      const incomingMessage = req.body
      validateMessage(incomingMessage)

      const data = await Request.start(req.body)

      console.log(`${data.length} results found for "${req.body.product}"`)
      // console.log(data)
      let responseData
      
      if (data.status) responseData = { 
        status: data.status, 
        message: data.message 
      }
      else responseData = {...resp.success, data}
      res.send(responseData)
    } catch (error) {
      res.send({ status: error.status || 500, message: error.message })
    }
  }
}

module.exports = Controller;