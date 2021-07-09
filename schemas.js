const Joi = require('joi');

module.exports.appointmentSchema = Joi.object({
    appointment: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required().min(0),
        weight: Joi.number().min(0),
        date: Joi.string().required(),
        slot: Joi.string().required(),
        purpose: Joi.string()
    }).required()
});