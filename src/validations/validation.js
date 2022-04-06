const Joi = require('joi')

const inputSchema = Joi.object({
    product: Joi.string().required().messages({
        'string.base': `"product" should be a type of 'text'`,
        'string.empty': `"product" cannot be an empty field`,
        'any.required': `"product" is a required field`}),
    quantity: Joi.number().integer().required().messages({
        'integer.base': `"quantity" should be a integer`,
        'integer.empty': `"quantity" cannot be an empty field`,
        'any.required': `"quantity" is a required field`
    })
})

const options = {
    abortEarly: false,
    stripUnknown: true
}

function schemaValidator(input){
    try {
        const results = inputSchema.validate(input, options)
        if (results.error) throw { status: 400, message: results.error.message }
        return results.value
    } catch(err){
        throw { status: err.status, message: err.message }
    }
}

module.exports = schemaValidator